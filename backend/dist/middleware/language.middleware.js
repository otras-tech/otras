"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LanguageMiddleware", {
    enumerable: true,
    get: function() {
        return LanguageMiddleware;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LanguageMiddleware = class LanguageMiddleware {
    use(req, res, next) {
        const language = req.headers['x-language'] || req.query.lang || 'en';
        req.language = language;
        next();
    }
};
LanguageMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], LanguageMiddleware);

//# sourceMappingURL=language.middleware.js.map