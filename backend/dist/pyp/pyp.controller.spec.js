"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _pypcontroller = require("./pyp.controller");
describe('PypController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _pypcontroller.PypController
            ]
        }).compile();
        controller = module.get(_pypcontroller.PypController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=pyp.controller.spec.js.map