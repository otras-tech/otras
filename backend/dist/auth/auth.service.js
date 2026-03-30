"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _userservice = require("../user/user.service");
const _adminservice = require("../admin/admin.service");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _prismaservice = require("../prisma/prisma.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    async validateUser(loginId, pass) {
        let user = await this.userService.findByEmail(loginId);
        if (!user) {
            user = await this.userService.findByOtrId(loginId);
        }
        if (user && await _bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user, isAdmin = false) {
        const payload = {
            email: user.email || user.username,
            sub: user.id,
            role: isAdmin ? 'ADMIN' : user.role || 'USER'
        };
        const tokens = await this.getTokens(payload.sub, payload.email, payload.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token, isAdmin);
        // Update last login
        if (isAdmin) {
            await this.prisma.admin.update({
                where: {
                    id: user.id
                },
                data: {
                    lastLogin: new Date()
                }
            });
        } else {
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    lastLogin: new Date()
                }
            });
        }
        return {
            ...tokens,
            user: isAdmin ? undefined : user,
            admin: isAdmin ? user : undefined
        };
    }
    async logout(userId, isAdmin = false) {
        if (isAdmin) {
            return this.prisma.admin.update({
                where: {
                    id: userId
                },
                data: {
                    refreshToken: null
                }
            });
        }
        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        });
    }
    async refreshTokens(userId, refreshToken, isAdmin = false) {
        const user = isAdmin ? await this.prisma.admin.findUnique({
            where: {
                id: userId
            }
        }) : await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user || !user.refreshToken) {
            throw new _common.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await _bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new _common.ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email || user.username, isAdmin ? 'ADMIN' : user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token, isAdmin);
        return tokens;
    }
    async updateRefreshToken(userId, refreshToken, isAdmin = false) {
        const hashedRefreshToken = await _bcrypt.hash(refreshToken, 10);
        if (isAdmin) {
            await this.prisma.admin.update({
                where: {
                    id: userId
                },
                data: {
                    refreshToken: hashedRefreshToken
                }
            });
        } else {
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    refreshToken: hashedRefreshToken
                }
            });
        }
    }
    async getTokens(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
                role
            }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1h'
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
                role
            }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d'
            })
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
    async register(data) {
        const user = await this.userService.create(data);
        return this.login(user);
    }
    constructor(userService, adminService, jwtService, configService, prisma){
        this.userService = userService;
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _adminservice.AdminService === "undefined" ? Object : _adminservice.AdminService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map