"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RefreshTokenStrategy", {
    enumerable: true,
    get: function() {
        return RefreshTokenStrategy;
    }
});
const _passport = require("@nestjs/passport");
const _passportjwt = require("passport-jwt");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RefreshTokenStrategy = class RefreshTokenStrategy extends (0, _passport.PassportStrategy)(_passportjwt.Strategy, 'jwt-refresh') {
    validate(req, payload) {
        const authHeader = req.get('Authorization');
        if (!authHeader) throw new _common.UnauthorizedException('No authorization header');
        const refreshToken = authHeader.replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken
        };
    }
    constructor(){
        super({
            jwtFromRequest: _passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
            passReqToCallback: true
        });
    }
};
RefreshTokenStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], RefreshTokenStrategy);

//# sourceMappingURL=refreshToken.strategy.js.map