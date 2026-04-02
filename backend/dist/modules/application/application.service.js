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
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const application_repository_1 = require("./repository/application.repository");
let ApplicationService = class ApplicationService {
    applicationRepository;
    constructor(applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    async create(requesterId, requesterRole, userId, examId) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('You can only apply for yourself');
        }
        return this.applicationRepository.upsert(userId, examId);
    }
    async findByUser(requesterId, requesterRole, userId) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.applicationRepository.findByUserId(userId);
    }
    async findByOtrId(otrId) {
        const result = await this.applicationRepository.findByOtrId(otrId);
        if (result === null)
            return [];
        return result;
    }
    async findAll() {
        return this.applicationRepository.findAll();
    }
    async updateStatus(requesterRole, id, statusData) {
        if (requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admins can update application status');
        }
        const existing = await this.applicationRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException('Application not found');
        return this.applicationRepository.updateStatus(id, statusData);
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [application_repository_1.ApplicationRepository])
], ApplicationService);
//# sourceMappingURL=application.service.js.map