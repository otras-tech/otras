import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../types/types';

/**
 * Custom parameter decorator to extract the authenticated user
 * from the request. Replaces `@Req() req` + `req.user` pattern.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: RequestUser) { ... }
 *
 *   @Get('id')
 *   getId(@CurrentUser('id') userId: number) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    return data ? user?.[data] : user;
  },
);
