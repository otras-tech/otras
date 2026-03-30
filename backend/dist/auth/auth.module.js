"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _authservice = require("./auth.service");
const _authcontroller = require("./auth.controller");
const _usermodule = require("../user/user.module");
const _adminmodule = require("../admin/admin.module");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _refreshTokenstrategy = require("./strategies/refreshToken.strategy");
const _prismamodule = require("../prisma/prisma.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _config.ConfigModule,
            _usermodule.UserModule,
            (0, _common.forwardRef)(()=>_adminmodule.AdminModule),
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _jwt.JwtModule.registerAsync({
                inject: [
                    _config.ConfigService
                ],
                useFactory: (config)=>({
                        secret: config.get('JWT_SECRET') || 'SECRET_KEY',
                        signOptions: {
                            expiresIn: '1h'
                        }
                    })
            })
        ],
        providers: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _refreshTokenstrategy.RefreshTokenStrategy
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        exports: [
            _authservice.AuthService,
            _passport.PassportModule,
            _jwt.JwtModule,
            _jwtstrategy.JwtStrategy,
            _refreshTokenstrategy.RefreshTokenStrategy
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map