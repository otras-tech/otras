"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserModule", {
    enumerable: true,
    get: function() {
        return UserModule;
    }
});
const _common = require("@nestjs/common");
const _userservice = require("./user.service");
const _usercontroller = require("./user.controller");
const _resultmodule = require("../result/result.module");
const _mocktestmodule = require("../mock-test/mock-test.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserModule = class UserModule {
    constructor(){
        this.logger = new _common.Logger(UserModule.name);
        this.logger.log('UserModule initialized');
    }
};
UserModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            (0, _common.forwardRef)(()=>_resultmodule.ResultModule),
            _mocktestmodule.MockTestModule
        ],
        providers: [
            _userservice.UserService
        ],
        controllers: [
            _usercontroller.UserController
        ],
        exports: [
            _userservice.UserService
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], UserModule);

//# sourceMappingURL=user.module.js.map