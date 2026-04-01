"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIdempotentJobOpts = buildIdempotentJobOpts;
exports.buildWindowedJobOpts = buildWindowedJobOpts;
function buildIdempotentJobOpts(entityType, entityId, action) {
    return {
        jobId: `${entityType}:${entityId}:${action}`,
    };
}
function buildWindowedJobOpts(entityType, entityId, action, windowMs = 3_600_000) {
    const window = Math.floor(Date.now() / windowMs) * windowMs;
    return {
        jobId: `${entityType}:${entityId}:${action}:w${window}`,
    };
}
//# sourceMappingURL=queue-utils.js.map