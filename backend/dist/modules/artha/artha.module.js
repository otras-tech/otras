"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArthaModule", {
    enumerable: true,
    get: function() {
        return ArthaModule;
    }
});
const _common = require("@nestjs/common");
const _arthacontroller = require("./artha.controller");
const _arthaservice = require("./artha.service");
const _artharepository = require("./repository/artha.repository");
const _prismamodule = require("../../prisma/prisma.module");
const _tier3metricsservice = require("./tier3-metrics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ArthaModule = class ArthaModule {
};
ArthaModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule
        ],
        controllers: [
            _arthacontroller.ArthaController
        ],
        providers: [
            _arthaservice.ArthaService,
            _artharepository.ArthaRepository,
            _tier3metricsservice.Tier3MetricsService
        ],
        exports: [
            _arthaservice.ArthaService
        ]
    })
], ArthaModule);

//# sourceMappingURL=artha.module.js.map