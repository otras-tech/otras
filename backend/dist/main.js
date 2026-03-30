"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("reflect-metadata");
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _appmodule = require("./app.module");
const _child_process = require("child_process");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _httpexceptionfilter = require("./common/filters/http-exception.filter");
const _rolesguard = require("./common/guards/roles.guard");
const _loggerservice = require("./logger/logger.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function bootstrap() {
    // Robust .env loader
    // ... (keep logic)
    const envPath = _path.resolve(process.cwd(), '.env');
    if (_fs.existsSync(envPath)) {
        const envContent = _fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach((line)=>{
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                } else if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value;
            }
        });
    }
    const port = process.env.PORT || 4000;
    console.log(`Starting backend on port ${port}...`);
    // Kill port logic
    try {
        if (process.platform === 'win32') {
            try {
                const stdout = (0, _child_process.execSync)(`netstat -ano | findstr :${port} | findstr LISTENING`).toString();
                const pid = stdout.trim().split(/\s+/).pop();
                if (pid && pid !== '0' && pid !== 'LISTENING') {
                    console.log(`Killing process ${pid} on port ${port}`);
                    (0, _child_process.execSync)(`taskkill /F /PID ${pid}`, {
                        stdio: 'ignore'
                    });
                }
            } catch (e) {}
        }
    } catch (e) {}
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        bufferLogs: true
    });
    const logger = app.get(_loggerservice.AppLogger);
    app.useLogger(logger);
    // Hardened Security Headers
    app.use((0, _helmet.default)());
    // API Performance (Gzip)
    app.use((0, _compression.default)());
    app.enableCors();
    // Apply Global Filters, Pipes and Guards
    app.useGlobalFilters(new _httpexceptionfilter.AllExceptionsFilter());
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const reflector = app.get(_core.Reflector);
    app.useGlobalGuards(new _rolesguard.RolesGuard(reflector));
    // Use express middleware for large payloads
    const express = require('express');
    app.use(express.json({
        limit: '10mb'
    }));
    app.use(express.urlencoded({
        limit: '10mb',
        extended: true
    }));
    try {
        await app.listen(port);
        logger.log(`Backend is running on: http://localhost:${port}`, 'Bootstrap');
    } catch (error) {
        logger.error('Backend failed to start', error.stack, 'Bootstrap');
    }
}
bootstrap();

//# sourceMappingURL=main.js.map