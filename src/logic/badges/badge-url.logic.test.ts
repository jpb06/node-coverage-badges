import { Effect, pipe } from 'effect';
import { runSync } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultLabelPrefix } from '@constants';
import { makeConsoleTestLayer } from '@tests/layers';
import { coverageSummaryFileContentMock } from '@tests/mock-data';
import { mockPicoColors } from '@tests/mocks';

import { getBadgeUrl } from './badge-url.logic.js';

const stripAnsiCodes = (data: string) =>
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intended
  data.replace(/\u001b[^m]*?m/g, '');

describe('badgeUrl function', () => {
  mockPicoColors();

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
    const { ConsoleTestLayer, infoMock } = makeConsoleTestLayer({});

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
    expect(infoMock).toHaveBeenCalledTimes(0);
  });

  it('should display debug info', () => {
    const { ConsoleTestLayer, infoMock } = makeConsoleTestLayer({});

    const summary = coverageSummaryFileContentMock(50);

    runSync(
      pipe(
        getBadgeUrl(summary, 'lines', 'vitest', defaultLabelPrefix, true),
        Effect.provide(ConsoleTestLayer),
      ),
    );

    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(infoMock).toHaveBeenCalledWith(
      stripAnsiCodes(
        '🔹 Generating red badge for lines metric with value [ 50% ].',
      ),
    );
  });
});
