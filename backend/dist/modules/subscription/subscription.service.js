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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const subscription_repository_1 = require("./repository/subscription.repository");
let SubscriptionService = class SubscriptionService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async create(data) {
        return this.subscriptionRepository.create({
            title: data.title,
            price: data.price,
            features: data.features,
            isRecommended: data.isRecommended,
        });
    }
    async findAll() {
        return this.subscriptionRepository.findAll();
    }
    async findOne(id) {
        const sub = await this.subscriptionRepository.findById(id);
        if (!sub)
            throw new common_1.NotFoundException('Subscription plan not found');
        return sub;
    }
    async update(id, data) {
        return this.subscriptionRepository.update(id, {
            title: data.title,
            price: data.price,
            features: data.features,
            isRecommended: data.isRecommended,
        });
    }
    async remove(id) {
        return this.subscriptionRepository.softDelete(id);
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_repository_1.SubscriptionRepository])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map