/**
 * Queue Idempotency Utilities
 *
 * BullMQ prevents duplicate job execution when a `jobId` is provided.
 * If a job with the same `jobId` already exists in the queue, the new
 * add() call is silently ignored.
 *
 * Usage:
 *   await queue.add('process-assessment', payload, {
 *     ...buildIdempotentJobOpts('assessment', assessmentId, 'process'),
 *   });
 */

import { JobsOptions } from 'bullmq';

/**
 * Builds BullMQ job options with a deterministic jobId.
 * Prevents duplicate jobs for the same entity+action combination.
 *
 * @param entityType  e.g., 'assessment', 'payment', 'report'
 * @param entityId    The unique ID of the entity being processed
 * @param action      The action being performed, e.g., 'process', 'generate', 'notify'
 * @returns           Partial<JobsOptions> with a deterministic jobId
 *
 * @example
 *   // These two calls produce the same jobId → second is deduplicated:
 *   buildIdempotentJobOpts('assessment', 'abc-123', 'process')
 *   // → { jobId: 'assessment:abc-123:process' }
 */
export function buildIdempotentJobOpts(
  entityType: string,
  entityId: string | number,
  action: string,
): Partial<JobsOptions> {
  return {
    jobId: `${entityType}:${entityId}:${action}`,
  };
}

/**
 * Builds a jobId with a time-window component so the same logical job
 * can be retried after the window expires (e.g., hourly reports).
 *
 * @param entityType  e.g., 'report', 'digest'
 * @param entityId    The unique ID
 * @param action      The action
 * @param windowMs    Time window in ms (default: 1 hour)
 *
 * @example
 *   buildWindowedJobOpts('digest', userId, 'send', 3600000)
 *   // → { jobId: 'digest:42:send:w1711720800000' }
 */
export function buildWindowedJobOpts(
  entityType: string,
  entityId: string | number,
  action: string,
  windowMs: number = 3_600_000,
): Partial<JobsOptions> {
  const window = Math.floor(Date.now() / windowMs) * windowMs;
  return {
    jobId: `${entityType}:${entityId}:${action}:w${window}`,
  };
}
