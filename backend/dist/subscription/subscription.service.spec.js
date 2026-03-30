"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _subscriptionservice = require("./subscription.service");
describe('SubscriptionService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _subscriptionservice.SubscriptionService
            ]
        }).compile();
        service = module.get(_subscriptionservice.SubscriptionService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=subscription.service.spec.js.map