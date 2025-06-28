import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  defaultDebug,
  defaultIcon,
  defaultLabelPrefix,
  defaultOutputDir,
} from '@constants';
import {
  makeConsoleTestLayer,
  makeFsTestLayer,
  makeHttpClientTestLayer,
} from '@tests/layers';
import { coverageSummaryFileContentMock } from '@tests/mock-data';

import { generateCoverageFile } from './generate-coverage-file.logic.js';

describe('generateCoverageFile function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should short circuit if there is no badge url', async () => {
    const summary = coverageSummaryFileContentMock();

    const { FsTestLayer } = makeFsTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});
    const { ConsoleTestLayer, infoMock, reportFailureMock } =
      makeConsoleTestLayer({
        info: Effect.void,
        reportFailure: Effect.void,
      });

    await runPromise(
      pipe(
        generateCoverageFile(
          summary,
          defaultOutputDir,
          defaultIcon,
          defaultLabelPrefix,
          defaultDebug,
        )('functions'),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, HttpClientTestLayer, ConsoleTestLayer),
        ),
      ),
    );

    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(infoMock).toHaveBeenCalledWith(
      "No value for key 'functions' found in coverage report",
    );
    expect(reportFailureMock).toHaveBeenCalledTimes(1);
    expect(reportFailureMock).toHaveBeenCalledWith(
      'generateCoverageFile: missing badgeUrl for functions',
    );
  });

  it('should not write the file if there is no data', async () => {
    const summary = coverageSummaryFileContentMock(33, 40, 32, 50);

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.void,
    });
    const { HttpClientTestLayer, getMock } = makeHttpClientTestLayer({
      get: Effect.succeed({ text: Effect.succeed('') }),
    });
    const { ConsoleTestLayer, reportFailureMock } = makeConsoleTestLayer({
      info: Effect.void,
      reportFailure: Effect.void,
    });

    await runPromise(
      pipe(
        generateCoverageFile(
          summary,
          defaultOutputDir,
          defaultIcon,
          defaultLabelPrefix,
          defaultDebug,
        )('functions'),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, HttpClientTestLayer, ConsoleTestLayer),
        ),
      ),
    );

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(reportFailureMock).toHaveBeenCalledTimes(1);
    expect(writeFileStringMock).toHaveBeenCalledTimes(0);
  });

  it('should write the file', async () => {
    const summary = coverageSummaryFileContentMock(33, 40, 32, 50);

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.void,
    });
    const { HttpClientTestLayer, getMock } = makeHttpClientTestLayer({
      get: Effect.succeed({ text: Effect.succeed('yolo') }),
    });
    const { ConsoleTestLayer, reportFailureMock } = makeConsoleTestLayer({
      info: Effect.void,
      reportFailure: Effect.void,
    });

    await runPromise(
      pipe(
        generateCoverageFile(
          summary,
          defaultOutputDir,
          defaultIcon,
          defaultLabelPrefix,
          defaultDebug,
        )('functions'),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, HttpClientTestLayer, ConsoleTestLayer),
        ),
      ),
    );

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(reportFailureMock).toHaveBeenCalledTimes(0);
    expect(writeFileStringMock).toHaveBeenCalledTimes(1);
  });
});
