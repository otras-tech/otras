"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppLogger", {
    enumerable: true,
    get: function() {
        return AppLogger;
    }
});
const _common = require("@nestjs/common");
const _winston = require("winston");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppLogger = class AppLogger {
    log(message, context) {
        this.logger.info(message, {
            context
        });
    }
    error(message, stack, context) {
        this.logger.error(message, {
            stack,
            context
        });
    }
    warn(message, context) {
        this.logger.warn(message, {
            context
        });
    }
    debug(message, context) {
        this.logger.debug(message, {
            context
        });
    }
    verbose(message, context) {
        this.logger.verbose(message, {
            context
        });
    }
    constructor(){
        this.logger = (0, _winston.createLogger)({
            level: 'info',
            format: _winston.format.combine(_winston.format.timestamp(), _winston.format.errors({
                stack: true
            }), _winston.format.splat(), _winston.format.json()),
            defaultMeta: {
                service: 'otras-api'
            },
            transports: [
                new _winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error'
                }),
                new _winston.transports.File({
                    filename: 'logs/combined.log'
                })
            ]
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new _winston.transports.Console({
                format: _winston.format.combine(_winston.format.colorize(), _winston.format.simple())
            }));
        }
    }
};
AppLogger = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], AppLogger);

//# sourceMappingURL=logger.service.js.map