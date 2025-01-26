import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultIcon, defaultOutputDir } from '@constants';
import {
  makeConsoleTestLayer,
  makeFsTestLayer,
  makeHttpClientTestLayer,
} from '@tests/layers';

import { generateCoverageFile } from '../coverage-file/generate-coverage-file.logic.js';
import {
  type CoverageSummaryValue,
  generateBadgesFromValuesEffect,
} from './generate-badges-from-values-effect.logic.js';

vi.mock('./../coverage-file/generate-coverage-file.logic.js', () => ({
  generateCoverageFile: vi.fn(),
}));

describe('generateBadgesFromValues function', () => {
  const rawValues: CoverageSummaryValue = {
    total: {
      branches: { pct: 10 },
      functions: { pct: 20 },
      lines: { pct: 30 },
      statements: { pct: 40 },
    },
  };

  const generateCoverageFileCurry = vi
    .fn()
    // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
    .mockImplementation(() => Effect.sync(() => {}));

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(generateCoverageFile).mockImplementation(
      () => generateCoverageFileCurry,
    );
  });

  it('should ensure outDir is there and clear it', async () => {
    const files = ['one.svg', 'apps/front/cool.svg'];

    const {
      FsTestLayer,
      existsMock,
      makeDirectoryMock,
      readDirectoryMock,
      removeMock,
    } = makeFsTestLayer({
      exists: Effect.succeed(false),
      makeDirectory: Effect.void,
      readDirectory: Effect.succeed(files),
      remove: Effect.void,
      readFileString: Effect.succeed('{}'),
    });
    const { ConsoleTestLayer } = makeConsoleTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    await runPromise(
      pipe(
        generateBadgesFromValuesEffect(
          rawValues,
          defaultOutputDir,
          defaultIcon,
        ),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(makeDirectoryMock).toHaveBeenCalledTimes(1);
    expect(makeDirectoryMock).toHaveBeenCalledWith(
      defaultOutputDir,
      expect.anything(),
    );
    expect(readDirectoryMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledTimes(2);
    expect(removeMock).toHaveBeenNthCalledWith(
      1,
      `${defaultOutputDir}/${files[0]}`,
    );
    expect(removeMock).toHaveBeenNthCalledWith(
      2,
      `${defaultOutputDir}/${files[1]}`,
    );
  });

  it('should generate all badges', async () => {
    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      makeDirectory: Effect.void,
      readDirectory: Effect.succeed([]),
      remove: Effect.void,
      readFileString: Effect.succeed('{}'),
    });
    const { ConsoleTestLayer, errorMock, reportFailureMock, reportErrorMock } =
      makeConsoleTestLayer({
        error: Effect.void,
        reportFailure: Effect.void,
        reportError: Effect.void,
      });
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    await runPromise(
      pipe(
        generateBadgesFromValuesEffect(
          rawValues,
          defaultOutputDir,
          defaultIcon,
        ),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
    expect(errorMock).toHaveBeenCalledTimes(0);
    expect(reportFailureMock).toHaveBeenCalledTimes(0);
    expect(reportErrorMock).toHaveBeenCalledTimes(0);
  });
});
