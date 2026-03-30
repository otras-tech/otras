"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OpenAiProvider", {
    enumerable: true,
    get: function() {
        return OpenAiProvider;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OpenAiProvider = class OpenAiProvider {
    async generateCompletion(systemPrompt, userPrompt) {
        // Example implementation using OpenAI SDK (would require standard npm install openai)
        /*
    import OpenAI from 'openai';
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
    });
    return response.choices[0].message.content;
    */ // Simulated multi-lingual response
        if (userPrompt.includes('Hindi')) {
            return 'आपकी परीक्षा तैयारी के लिए 12 सप्ताह की अध्ययन योजना:\nसप्ताह 1–2: गणित के मूलभूत सिद्धांतों का अभ्यास करें।\nसप्ताह 3–4: रीजनिंग प्रश्नों पर ध्यान दें।';
        }
        if (userPrompt.includes('Telugu')) {
            return 'మీ పరీక్షా సిద్ధత కోసం 12 వారాల అధ్యయన ప్రణాళిక:\nవారం 1–2: గణిత ప్రాథమిక అంశాలను అభ్యసించండి.\nవారం 3–4: రీజనింగ్ ప్రశ్నలపై దృష్టి పెట్టండి.';
        }
        return '12-week study plan for your exam preparation:\nWeek 1-2: Practice fundamental math principles.\nWeek 3-4: Focus on reasoning questions.';
    }
};
OpenAiProvider = _ts_decorate([
    (0, _common.Injectable)()
], OpenAiProvider);

//# sourceMappingURL=openai.provider.js.map