"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('llama', () => ({
    endpoint: process.env.LLAMA_ENDPOINT ||
        'http://localhost:11434/api/generate',
    model: process.env.LLAMA_MODEL || 'llama3',
    timeout: parseInt(process.env.AI_TIMEOUT || '30000'),
}));
//# sourceMappingURL=llama.config.js.map