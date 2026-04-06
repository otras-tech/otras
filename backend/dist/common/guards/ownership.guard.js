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
var OwnershipGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const check_ownership_decorator_1 = require("../decorators/check-ownership.decorator");
let OwnershipGuard = OwnershipGuard_1 = class OwnershipGuard {
    reflector;
    logger = new common_1.Logger(OwnershipGuard_1.name);
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const options = this.reflector.get(check_ownership_decorator_1.CHECK_OWNERSHIP_KEY, context.getHandler());
        if (!options)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required for ownership check');
        }
        if (user.role?.toUpperCase() === 'ADMIN') {
            return true;
        }
        const paramName = options.param || 'id';
        const targetIdStr = request.params[paramName] ||
            request.body[paramName] ||
            request.query[paramName];
        if (!targetIdStr) {
            this.logger.warn(`OwnershipGuard: Target ID '${paramName}' not found in request context`);
            return true;
        }
        const targetId = parseInt(targetIdStr, 10);
        if (user.id !== targetId) {
            this.logger.error(`Ownership Error: User ${user.id} (${user.email}) attempted to access resource belonging to User ${targetId}`);
            throw new common_1.ForbiddenException('Access denied: Ownership verification failed');
        }
        return true;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = OwnershipGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map