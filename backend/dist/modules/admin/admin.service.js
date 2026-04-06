"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./repository/admin.repository");
const auth_service_1 = require("../auth/auth.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    repository;
    authService;
    constructor(repository, authService) {
        this.repository = repository;
        this.authService = authService;
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            const admin = await this.repository.create({
                ...data,
                password: hashedPassword,
            });
            return this.login(admin);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Admin email or username already exists');
            }
            throw error;
        }
    }
    async login(admin) {
        const tokens = await this.authService.getTokens(admin.id, admin.email, 'ADMIN');
        return {
            ...tokens,
            admin,
        };
    }
    async validateAdmin(email, pass) {
        const admin = await this.repository.findByEmail(email);
        if (admin && !admin.isDeleted) {
            if (await bcrypt.compare(pass, admin.password)) {
                return admin;
            }
        }
        return null;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map