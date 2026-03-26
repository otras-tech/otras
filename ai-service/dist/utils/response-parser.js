"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseParser = void 0;
class ResponseParser {
    static parse(provider, model, rawResponse) {
        if (!rawResponse) {
            return {
                text: '',
                provider,
                model,
                createdAt: Date.now()
            };
        }
        if (typeof rawResponse === 'string') {
            return {
                text: rawResponse,
                provider,
                model,
                createdAt: Date.now()
            };
        }
        if (rawResponse.choices && rawResponse.choices[0]?.message?.content) {
            return {
                text: rawResponse.choices[0].message.content,
                provider,
                model,
                tokensUsed: rawResponse.usage?.total_tokens,
                createdAt: Date.now()
            };
        }
        return {
            text: JSON.stringify(rawResponse),
            provider,
            model,
            createdAt: Date.now()
        };
    }
}
exports.ResponseParser = ResponseParser;
//# sourceMappingURL=response-parser.js.map