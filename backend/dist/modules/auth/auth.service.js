"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../common/redis/redis.service");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_repository_1 = require("./repository/auth.repository");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    userService;
    jwtService;
    configService;
    repository;
    redisService;
    logger = new common_1.Logger(AuthService_1.name);
    BCRYPT_ROUNDS = 12;
    MAX_SESSIONS = 5;
    constructor(userService, jwtService, configService, repository, redisService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.repository = repository;
        this.redisService = redisService;
    }
    async validateUser(loginId, pass) {
        const user = await this.userService.findByEmail(loginId);
        const targetUser = user || (await this.userService.findByOtrId(loginId));
        if (targetUser &&
            !targetUser.isDeleted &&
            (await bcrypt.compare(pass, targetUser.password))) {
            const { password, ...result } = targetUser;
            return result;
        }
        return null;
    }
    async register(data) {
        const user = await this.userService.create(data);
        if (!user) {
            throw new common_1.UnauthorizedException('Registration failed');
        }
        const { password: _pw, ...safeUser } = user;
        return this.login(safeUser);
    }
    async login(user) {
        if (!user.id || !user.email) {
            throw new common_1.UnauthorizedException('Invalid user data');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role || 'USER');
        return {
            ...tokens,
            user,
        };
    }
    async logout(userId, jti) {
        await this.repository.deleteTokenByJti(jti, userId);
        return { success: true };
    }
    async logoutAll(userId) {
        await this.repository.deleteTokensByUserId(userId);
        return { success: true };
    }
    async refreshTokens(userId, rt, jti) {
        const lockKey = `refresh:${userId}:${jti}`;
        const lockTtl = 10000;
        const lockValue = await this.redisService.acquireLock(lockKey, lockTtl);
        if (!lockValue) {
            this.logger.warn(`Refresh token rotation in progress for user ${userId}, jti ${jti}`);
            throw new common_1.HttpException('Too Many Requests', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        try {
            const tokenRecord = await this.repository.findTokenById(jti);
            if (!tokenRecord || tokenRecord.userId !== userId) {
                this.logger.warn(`Invalid JTI for user ${userId}`);
                throw new common_1.ForbiddenException('Access Denied');
            }
            if (new Date() > tokenRecord.expiresAt) {
                await this.repository.deleteToken(jti);
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            const rtMatches = await bcrypt.compare(rt, tokenRecord.tokenHash);
            if (!rtMatches) {
                this.logger.error(`Token reuse detected for user ${userId}. Revoking all sessions.`);
                await this.logoutAll(userId);
                throw new common_1.ForbiddenException('Security Breach Detected');
            }
            const user = await this.userService.findById(userId);
            if (!user || user.isDeleted) {
                throw new common_1.ForbiddenException('User deactivated');
            }
            return await this.repository.runTransaction(async (tx) => {
                await this.repository.deleteToken(jti, tx);
                return this.getTokens(user.id, user.email, user.role, tx);
            });
        }
        finally {
            await this.redisService.releaseLock(lockKey, lockValue);
        }
    }
    async getTokens(userId, email, role, tx) {
        const jti = (0, uuid_1.v4)();
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ sub: userId, email, role, jti }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        const sessionCount = await this.repository.countTokensByUserId(userId, tx);
        if (sessionCount >= this.MAX_SESSIONS) {
            const oldestSession = await this.repository.findOldestSession(userId, tx);
            if (oldestSession) {
                await this.repository.deleteToken(oldestSession.id, tx);
            }
        }
        const tokenHash = await bcrypt.hash(rt, this.BCRYPT_ROUNDS);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.repository.createRefreshToken({
            id: jti,
            userId,
            tokenHash,
            expiresAt,
        }, tx);
        return { access_token: at, refresh_token: rt };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        auth_repository_1.AuthRepository,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map