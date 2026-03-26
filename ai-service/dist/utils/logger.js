"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
class AppLogger {
    static log(message) {
        this.logger.log(message);
    }
    static error(message, trace) {
        this.logger.error(message, trace);
    }
    static warn(message) {
        this.logger.warn(message);
    }
    static debug(message) {
        this.logger.debug(message);
    }
}
exports.AppLogger = AppLogger;
AppLogger.logger = new common_1.Logger('AI-Service');
//# sourceMappingURL=logger.js.map