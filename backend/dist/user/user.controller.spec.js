"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _usercontroller = require("./user.controller");
describe('UserController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _usercontroller.UserController
            ]
        }).compile();
        controller = module.get(_usercontroller.UserController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=user.controller.spec.js.map