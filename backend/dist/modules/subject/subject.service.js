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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const subject_repository_1 = require("./repository/subject.repository");
let SubjectService = class SubjectService {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    create(data) {
        const { examId, ...rest } = data;
        const createInput = { ...rest };
        if (examId) {
            createInput.exams = { connect: { id: examId } };
        }
        console.log(this.subjectRepository.create(createInput));
        return this.subjectRepository.create(createInput);
    }
    findAll(cursor, take) {
        return this.subjectRepository.findAll(cursor, take);
    }
    async findOne(id) {
        const subject = await this.subjectRepository.findById(id);
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        return subject;
    }
    update(id, data) {
        const { examId, ...rest } = data;
        const updateInput = { ...rest };
        if (examId) {
            updateInput.exams = { connect: { id: examId } };
        }
        return this.subjectRepository.update(id, updateInput);
    }
    remove(id) {
        return this.subjectRepository.softDelete(id);
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subject_repository_1.SubjectRepository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map