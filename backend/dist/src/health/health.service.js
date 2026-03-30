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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
let HealthService = class HealthService extends terminus_1.HealthIndicator {
    configService;
    constructor(configService) {
        super();
        this.configService = configService;
    }
    async checkRedis() {
        const isRedisDisabled = this.configService.get('DISABLE_REDIS') === 'true';
        const redisUrl = this.configService.get('REDIS_URL') || 'redis://127.0.0.1:6379';
        const client = (0, redis_1.createClient)({
            url: redisUrl,
            socket: {
                connectTimeout: 2000,
                reconnectStrategy: false
            }
        });
        try {
            if (isRedisDisabled) {
                return this.getStatus('redis', true, { message: 'Skipped (Disabled)' });
            }
            await client.connect();
            await client.ping();
            await client.quit();
            return this.getStatus('redis', true);
        }
        catch (e) {
            return this.getStatus('redis', isRedisDisabled, { message: e.message });
        }
        finally {
            if (client.isOpen)
                await client.disconnect();
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HealthService);
//# sourceMappingURL=health.service.js.map