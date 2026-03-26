"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('ai', () => ({
    defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'openai',
    timeout: parseInt(process.env.AI_TIMEOUT || '30000'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
}));
//# sourceMappingURL=ai.config.js.map