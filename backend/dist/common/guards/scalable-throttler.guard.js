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
var ScalableThrottlerGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalableThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
let ScalableThrottlerGuard = ScalableThrottlerGuard_1 = class ScalableThrottlerGuard extends throttler_1.ThrottlerGuard {
    configService;
    logger = new common_1.Logger(ScalableThrottlerGuard_1.name);
    constructor(options, storage, reflector, configService) {
        super(options, storage, reflector);
        this.configService = configService;
    }
    async shouldSkip(context) {
        const request = context.switchToHttp().getRequest();
        const configDisable = this.configService.get('throttler.disable');
        const envDisable = this.configService.get('DISABLE_THROTTLER');
        this.logger.debug(`Checking throttle skip: throttler.disable=${configDisable}, DISABLE_THROTTLER=${envDisable}`);
        const disableThrottler = configDisable === true ||
            configDisable === 'true' ||
            envDisable === 'true' ||
            envDisable === true;
        if (disableThrottler) {
            this.logger.debug('Throttler disabled, skipping...');
            return true;
        }
        const internalSecret = this.configService.get('INTERNAL_LOAD_TEST_SECRET');
        const requestSecret = request.headers['x-internal-secret'];
        if (internalSecret && requestSecret === internalSecret) {
            this.logger.debug(`Bypassing throttler for internal request: ${request.url}`);
            return true;
        }
        return false;
    }
};
exports.ScalableThrottlerGuard = ScalableThrottlerGuard;
exports.ScalableThrottlerGuard = ScalableThrottlerGuard = ScalableThrottlerGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, core_1.Reflector,
        config_1.ConfigService])
], ScalableThrottlerGuard);
//# sourceMappingURL=scalable-throttler.guard.js.map