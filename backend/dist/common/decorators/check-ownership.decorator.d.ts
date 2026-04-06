export declare const CHECK_OWNERSHIP_KEY = "checkOwnership";
export interface OwnershipOptions {
    param?: string;
}
export declare const CheckOwnership: (options?: OwnershipOptions) => import("@nestjs/common").CustomDecorator<string>;
