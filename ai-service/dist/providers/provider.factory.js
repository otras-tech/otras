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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFactory = void 0;
const common_1 = require("@nestjs/common");
const openai_provider_1 = require("./openai.provider");
const mistral_provider_1 = require("./mistral.provider");
const llama_provider_1 = require("./llama.provider");
let ProviderFactory = class ProviderFactory {
    constructor(openai, mistral, llama) {
        this.openai = openai;
        this.mistral = mistral;
        this.llama = llama;
    }
    getProvider() {
        const provider = process.env.AI_PROVIDER || 'openai';
        switch (provider) {
            case 'mistral':
                return this.mistral;
            case 'llama':
                return this.llama;
            default:
                return this.openai;
        }
    }
};
exports.ProviderFactory = ProviderFactory;
exports.ProviderFactory = ProviderFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_provider_1.OpenAIProvider,
        mistral_provider_1.MistralProvider,
        llama_provider_1.LlamaProvider])
], ProviderFactory);
//# sourceMappingURL=provider.factory.js.map