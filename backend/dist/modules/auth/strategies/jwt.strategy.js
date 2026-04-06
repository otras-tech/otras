"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../user/user.service");
const admin_service_1 = require("../../admin/admin.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    configService;
    userService;
    adminService;
    logger = new common_1.Logger(JwtStrategy_1.name);
    constructor(configService, userService, adminService) {
        const accessSecret = (configService.get('JWT_ACCESS_SECRET') || configService.get('jwt.accessSecret') || 'secret').trim();
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accessSecret,
        });
        this.configService = configService;
        this.userService = userService;
        this.adminService = adminService;
        console.log(`[AUTH-STRATEGY-PROOF] Secret Length: ${accessSecret.length}, Prefix: ${accessSecret.substring(0, 4)}...`);
    }
    async validate(payload) {
        const logger = new common_1.Logger(JwtStrategy_1.name);
        logger.debug(`[JWT-STRATEGY] Validating token for Payload: ${JSON.stringify(payload)}`);
        if (!payload.sub || isNaN(Number(payload.sub))) {
            logger.warn(`[JWT-STRATEGY] Invalid payload: missing or non-numeric sub`);
            throw new common_1.UnauthorizedException('Invalid token payload: missing sub');
        }
        const userId = Number(payload.sub);
        const role = payload.role?.toUpperCase();
        logger.verbose(`[JWT-STRATEGY] Lookup initiated for ${role} with ID ${userId}`);
        let identity = null;
        try {
            if (role === 'ADMIN') {
                identity = await this.adminService.findById(userId);
            }
            else {
                identity = await this.userService.findById(userId);
            }
        }
        catch (dbError) {
            logger.error(`[JWT-STRATEGY] Database lookup failed: ${dbError.message}`);
            throw new common_1.UnauthorizedException('Identity lookup failed');
        }
        if (!identity || identity.isDeleted) {
            logger.warn(`[JWT-STRATEGY] ${role || 'User'} ${userId} not found or deleted`);
            throw new common_1.UnauthorizedException(`${role || 'User'} account invalid or inactive`);
        }
        logger.debug(`[JWT-STRATEGY] Identity verified: ${identity.email} (Role: ${identity.role || role})`);
        return {
            id: identity.id,
            email: identity.email,
            role: identity.role || role || 'USER',
            otrId: identity.otrId || null,
            jti: payload.jti,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService,
        admin_service_1.AdminService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map