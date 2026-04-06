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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    constructor(config) {
        const dbUrl = config.get('DATABASE_URL');
        const hasLimit = dbUrl.includes('connection_limit=');
        const finalUrl = hasLimit
            ? dbUrl
            : `${dbUrl}${dbUrl.includes('?') ? '&' : '?'}connection_limit=10&pool_timeout=30`;
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'error' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
            ],
            datasources: {
                db: {
                    url: finalUrl,
                },
            },
        });
        this.$on('query', (e) => {
            if (e.duration >= 200) {
                this.logger.warn({
                    msg: `Slow Query Detected`,
                    duration: `${e.duration}ms`,
                    query: e.query,
                    params: e.params,
                });
            }
        });
    }
    async onModuleInit() {
        this.logger.log('PrismaService connecting...');
        try {
            await this.$connect();
            this.logger.log('PrismaService connected successfully');
        }
        catch (error) {
            this.logger.error('PrismaService connection failed', error.stack);
            throw error;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map