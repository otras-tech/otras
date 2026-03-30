"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _subscriptioncontroller = require("./subscription.controller");
describe('SubscriptionController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _subscriptioncontroller.SubscriptionController
            ]
        }).compile();
        controller = module.get(_subscriptioncontroller.SubscriptionController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=subscription.controller.spec.js.map