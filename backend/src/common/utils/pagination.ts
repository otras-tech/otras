import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto<T> {
  @ApiProperty({ description: 'The array of returned items' })
  data!: T[];

  @ApiProperty({ description: 'Count of returned items' })
  count!: number;

  @ApiProperty({
    description: 'The cursor ID to fetch the next sequential page (if any)',
  })
  nextCursor?: number | string | null;

  @ApiProperty({
    description: 'Boolean identifying whether there are more pages available',
  })
  hasNextPage!: boolean;
}

export interface PaginationParams {
  limit?: number;
  cursor?: number | string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Standardize generic pagination for any database cursor response.
 * Enforces production safety limits.
 */
export function buildPaginatedResponse<T>(
  items: T[],
  requestedLimit: number,
  cursorField: keyof T = 'id' as keyof T,
): PaginatedResultDto<T> {
  // Production Safety: Enforce hard cap of 100 items per request
  const limit = Math.min(requestedLimit || 10, 100);

  const hasNextPage = items.length > limit;
  // If we fetched limit + 1 successfully, pop the last item before returning to client
  const edges = hasNextPage ? items.slice(0, limit) : items;

  const nextCursor =
    hasNextPage && edges.length > 0
      ? (edges[edges.length - 1][cursorField] as string | number | null)
      : null;

  return {
    data: edges,
    count: edges.length,
    nextCursor,
    hasNextPage,
  };
}
