"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const SENSITIVE_KEYS = new Set(['password', 'token', 'secret', 'authorization', 'cookie', 'tokenHash', 'refreshToken']);
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.id || request.headers['x-request-id'] || 'unknown';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'object' ? res.message : res;
            error = typeof res === 'object' ? res.error : 'Error';
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            switch (exception.code) {
                case 'P2002':
                    message = `Duplicate field value: ${exception.meta?.target}`;
                    break;
                case 'P2025':
                    status = common_1.HttpStatus.NOT_FOUND;
                    message = 'Record not found';
                    break;
                default:
                    message = `Database error: ${exception.message}`;
            }
            error = 'Bad Request';
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            requestId,
            message: Array.isArray(message) ? message[0] : message,
            error: error,
        };
        const logContext = {
            requestId,
            method: request.method,
            url: request.url,
            statusCode: status,
            userId: request.user?.id || request.user?.sub,
        };
        if (status >= 500) {
            this.logger.error(`[${requestId}] ${request.method} ${request.url} [${status}]`, exception.stack || JSON.stringify(this.redactSensitiveData(exception)), JSON.stringify(logContext));
        }
        else {
            this.logger.warn(`[${requestId}] ${request.method} ${request.url} [${status}]: ${JSON.stringify(message)}`);
        }
        response.status(status).json(errorResponse);
    }
    redactSensitiveData(obj) {
        if (!obj || typeof obj !== 'object')
            return obj;
        const result = Array.isArray(obj) ? [] : {};
        for (const [key, value] of Object.entries(obj)) {
            if (SENSITIVE_KEYS.has(key.toLowerCase())) {
                result[key] = '[REDACTED]';
            }
            else if (typeof value === 'object' && value !== null) {
                result[key] = this.redactSensitiveData(value);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map