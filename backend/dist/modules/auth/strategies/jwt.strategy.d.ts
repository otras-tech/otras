import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AdminService } from '../../admin/admin.service';
import { JwtPayload, RequestUser } from '../../../common/types/types';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    private adminService;
    private readonly logger;
    constructor(configService: ConfigService, userService: UserService, adminService: AdminService);
    validate(payload: JwtPayload): Promise<RequestUser>;
}
export {};
