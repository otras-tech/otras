import { SetMetadata } from '@nestjs/common';

export const CHECK_OWNERSHIP_KEY = 'checkOwnership';
export interface OwnershipOptions {
  param?: string; // The request param/body/query key to check (default: 'id')
}

/**
 * Decorator to mark a route for ownership verification.
 * By default, it checks Request.params.id against the authenticated user's ID.
 */
export const CheckOwnership = (options?: OwnershipOptions) =>
  SetMetadata(CHECK_OWNERSHIP_KEY, options || {});
