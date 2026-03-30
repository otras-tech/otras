"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminController", {
    enumerable: true,
    get: function() {
        return AdminController;
    }
});
const _common = require("@nestjs/common");
const _adminservice = require("./admin.service");
const _authservice = require("../auth/auth.service");
const _passport = require("@nestjs/passport");
const _express = require("express");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AdminController = class AdminController {
    async register(body) {
        const admin = await this.adminService.register(body);
        return this.authService.login(admin, true);
    }
    async login(body) {
        const admin = await this.adminService.validateAdmin(body.email, body.password);
        if (!admin) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(admin, true);
    }
    async logout(req) {
        const userId = req.user.id;
        return this.authService.logout(userId, true);
    }
    async refreshTokens(req) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken, true);
    }
    constructor(adminService, authService){
        this.adminService = adminService;
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt')),
    (0, _common.Get)('logout'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt-refresh')),
    (0, _common.Get)('refresh'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminController.prototype, "refreshTokens", null);
AdminController = _ts_decorate([
    (0, _common.Controller)('admin/auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminservice.AdminService === "undefined" ? Object : _adminservice.AdminService,
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AdminController);

//# sourceMappingURL=admin.controller.js.map