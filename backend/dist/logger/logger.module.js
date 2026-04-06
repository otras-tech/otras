"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("./logger.service");
const uuid_1 = require("uuid");
const REDACTED_FIELDS = [
    'password',
    'token',
    'cookie',
    'set-cookie',
    'tokenHash',
];
let LoggerModule = class LoggerModule {
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    pinoHttp: {
                        level: config.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
                        transport: config.get('NODE_ENV') !== 'production'
                            ? { target: 'pino-pretty', options: { colorize: true } }
                            : undefined,
                        genReqId: (req) => {
                            return req.headers['x-request-id'] || (0, uuid_1.v4)();
                        },
                        autoLogging: true,
                        customProps: (req) => ({
                            userId: req.user?.id ||
                                req.user?.sub,
                            correlationId: req.id,
                        }),
                        serializers: {
                            req: (req) => {
                                const headers = { ...req.headers };
                                REDACTED_FIELDS.forEach((f) => {
                                    if (headers[f])
                                        headers[f] = '[REDACTED]';
                                });
                                return {
                                    id: req.id,
                                    method: req.method,
                                    url: req.url,
                                    query: req.query,
                                    params: req.params,
                                    headers,
                                };
                            },
                            res: (res) => ({
                                statusCode: res.statusCode,
                            }),
                        },
                        redact: {
                            paths: REDACTED_FIELDS.map((f) => `*.${f}`),
                            censor: '[REDACTED]',
                        },
                    },
                }),
            }),
        ],
        providers: [logger_service_1.LoggerService],
        exports: [logger_service_1.LoggerService, nestjs_pino_1.LoggerModule],
    })
], LoggerModule);
//# sourceMappingURL=logger.module.js.map