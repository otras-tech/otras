import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtRefreshPayload, RequestUser } from '../../../common/types/types';
declare const JwtRefreshStrategy_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(req: Request, payload: JwtRefreshPayload): Promise<RequestUser>;
}
export {};
