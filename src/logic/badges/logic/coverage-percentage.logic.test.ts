import { Effect, pipe } from 'effect';
import { runSync } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeConsoleTestLayer } from '@tests/layers';
import { coverageSummaryFileContentMock } from '@tests/mock-data';

import { getPercentage } from './coverage-percentage.logic.js';

describe('getCoveragePercentage function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the branches percentage', () => {
    const summary = coverageSummaryFileContentMock(10, 20, 30, 40);

    const { ConsoleTestLayer } = makeConsoleTestLayer({});

    const result = runSync(
      pipe(
        getPercentage(summary, 'branches'),
        Effect.provide(ConsoleTestLayer),
      ),
    );

    expect(result).toBe(30);
  });

  it('should return total percentage', () => {
    const summary = coverageSummaryFileContentMock(10, 20, 30, 40);

    const { ConsoleTestLayer } = makeConsoleTestLayer({});

    const result = runSync(
      pipe(getPercentage(summary, 'total'), Effect.provide(ConsoleTestLayer)),
    );

    const total = (10 + 20 + 30 + 40) / 4;
    expect(result).toBe(total);
  });

  it('should return total percentage even if a key is missing', () => {
    const summary = coverageSummaryFileContentMock(10, 20, 30);

    const { ConsoleTestLayer } = makeConsoleTestLayer({});

    const result = runSync(
      pipe(getPercentage(summary, 'total'), Effect.provide(ConsoleTestLayer)),
    );

    const total = (10 + 20 + 30) / 4;
    expect(result).toBe(total);
  });

  it('should display a message if a key is missing', () => {
    const summary = coverageSummaryFileContentMock(10, 20, 30);

    const { ConsoleTestLayer, infoMock } = makeConsoleTestLayer({
      info: Effect.void,
    });

    const result = runSync(
      pipe(
        getPercentage(summary, 'functions'),
        Effect.provide(ConsoleTestLayer),
      ),
    );

    expect(result).toBeUndefined();
    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(infoMock).toHaveBeenCalledWith(
      `No value for key 'functions' found in coverage report`,
    );
  });

  it('should accurately report total percentage if a key has a percentage at 0', () => {
    const summary = coverageSummaryFileContentMock(10, 20, 30, 0);

    const { ConsoleTestLayer } = makeConsoleTestLayer({});

    const result = runSync(
      pipe(getPercentage(summary, 'total'), Effect.provide(ConsoleTestLayer)),
    );

    const total = (10 + 20 + 30) / 4;
    expect(result).toBe(total);
  });
});
