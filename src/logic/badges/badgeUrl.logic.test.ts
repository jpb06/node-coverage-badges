/* eslint-disable no-console */
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { coverageSummaryFileContentMock, mockConsole } from 'tests';

import { getBadgeUrl } from './badgeUrl.logic';

describe('badgeUrl function', () => {
  mockConsole({
    info: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined if percentage is missing', () => {
    const summary = coverageSummaryFileContentMock();

    const result = getBadgeUrl(summary, 'branches', 'vitest');

    expect(result).toBeUndefined();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(
      "No value for key 'branches' found in coverage report",
    );
  });

  it('should return the badge url', () => {
    const summary = coverageSummaryFileContentMock(50);

    const result = getBadgeUrl(summary, 'lines', 'vitest');

    expect(result).toBe(
      'https://img.shields.io/badge/lines-50%25-red?logo=vitest',
    );
  });
});
