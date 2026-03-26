"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mistral', () => ({
    apiKey: process.env.MISTRAL_API_KEY,
    endpoint: process.env.MISTRAL_ENDPOINT ||
        'https://api.mistral.ai/v1/chat/completions',
    model: process.env.MISTRAL_MODEL || 'mistral-medium',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '6000'),
    timeout: parseInt(process.env.AI_TIMEOUT || '90000'),
}));
//# sourceMappingURL=mistral.config.js.map