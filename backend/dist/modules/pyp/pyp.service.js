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
exports.PypService = void 0;
const common_1 = require("@nestjs/common");
const pyp_repository_1 = require("./repository/pyp.repository");
let PypService = class PypService {
    pypRepository;
    constructor(pypRepository) {
        this.pypRepository = pypRepository;
    }
    async create(data) {
        const { examId, ...rest } = data;
        return this.pypRepository.create({
            ...rest,
            exam: { connect: { id: examId } },
        });
    }
    async findAll() {
        return this.pypRepository.findAll();
    }
    async update(id, data) {
        const { examId, ...rest } = data;
        const updateData = { ...rest };
        if (examId) {
            updateData.exam = { connect: { id: examId } };
        }
        return this.pypRepository.update(id, updateData);
    }
    async remove(id) {
        return this.pypRepository.softDelete(id);
    }
};
exports.PypService = PypService;
exports.PypService = PypService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pyp_repository_1.PypRepository])
], PypService);
//# sourceMappingURL=pyp.service.js.map