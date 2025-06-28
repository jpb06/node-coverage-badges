import { Effect, pipe } from 'effect';
import { runSync } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultLabelPrefix } from '@constants';
import { makeConsoleTestLayer } from '@tests/layers';
import { coverageSummaryFileContentMock } from '@tests/mock-data';

import { getBadgeUrl } from './badge-url.logic.js';

describe('badgeUrl function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined if percentage is missing', () => {
    const { ConsoleTestLayer, infoMock } = makeConsoleTestLayer({
      info: Effect.void,
    });

    const summary = coverageSummaryFileContentMock();

    const result = runSync(
      pipe(
        getBadgeUrl(summary, 'branches', 'vitest', defaultLabelPrefix, false),
        Effect.provide(ConsoleTestLayer),
      ),
    );

    expect(result).toBeUndefined();
    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(infoMock).toHaveBeenCalledWith(
      "No value for key 'branches' found in coverage report",
    );
  });

  it('should return the badge url', () => {
    const { ConsoleTestLayer } = makeConsoleTestLayer({});

    const summary = coverageSummaryFileContentMock(50);

    const result = runSync(
      pipe(
        getBadgeUrl(summary, 'lines', 'vitest', defaultLabelPrefix, false),
        Effect.provide(ConsoleTestLayer),
      ),
    );

    expect(result).toBe(
      'https://img.shields.io/badge/Test%20coverage:%20lines-50%25-red?logo=vitest',
    );
  });
});
