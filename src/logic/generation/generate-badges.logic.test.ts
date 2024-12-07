import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultIcon, defaultOutputDir, defaultSummaryPath } from '@constants';
import {
  FsTestLayerError,
  makeConsoleTestLayer,
  makeFsTestLayer,
  makeHttpClientTestLayer,
} from '@tests/layers';

import { generateCoverageFile } from './coverage-file/generate-coverage-file.logic.js';
import { generateBadgesEffect } from './generate-badges.logic.js';

vi.mock('./coverage-file/generate-coverage-file.logic', () => ({
  generateCoverageFile: vi.fn(),
}));

describe('generateBadges function', () => {
  const generateCoverageFileCurry = vi
    .fn()
    // biome-ignore lint/suspicious/noEmptyBlockStatements: mock
    .mockImplementation(() => Effect.sync(() => {}));

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(generateCoverageFile).mockImplementation(
      () => generateCoverageFileCurry,
    );
  });

  it('should ensure outDir is there and clear it', async () => {
    const files = ['1.svg', '2.svg', '3.svg'];

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
        generateBadgesEffect(defaultSummaryPath, defaultOutputDir, defaultIcon),
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
    expect(removeMock).toHaveBeenCalledTimes(3);
    expect(removeMock).toHaveBeenNthCalledWith(
      1,
      `${defaultOutputDir}/${files[0]}`,
    );
    expect(removeMock).toHaveBeenNthCalledWith(
      2,
      `${defaultOutputDir}/${files[1]}`,
    );
    expect(removeMock).toHaveBeenNthCalledWith(
      3,
      `${defaultOutputDir}/${files[2]}`,
    );
  });

  it('should generate all badges', async () => {
    const { FsTestLayer, readFileStringMock } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readDirectory: Effect.succeed([]),
      readFileString: Effect.succeed('{ "yolo": "bro" }'),
    });
    const { ConsoleTestLayer } = makeConsoleTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    await runPromise(
      pipe(
        generateBadgesEffect(defaultSummaryPath, defaultOutputDir, defaultIcon),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(readFileStringMock).toHaveBeenCalledTimes(1);
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
  });

  it('should report on errors', async () => {
    const { FsTestLayer, existsMock } = makeFsTestLayer({
      exists: Effect.fail(new FsTestLayerError({})),
    });
    const { ConsoleTestLayer } = makeConsoleTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    const error = await runPromise(
      pipe(
        generateBadgesEffect(defaultSummaryPath, defaultOutputDir, defaultIcon),
        Effect.scoped,
        Effect.flip,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(error._tag).toBe('fs-test-layer-error');
    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(generateCoverageFile).toHaveBeenCalledTimes(0);
  });

  it('should use default values', async () => {
    const { FsTestLayer, readFileStringMock } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readDirectory: Effect.succeed(['one.svg', 'apps/front/cool.svg']),
      readFileString: Effect.succeed('{}'),
      remove: Effect.void,
    });
    const { ConsoleTestLayer } = makeConsoleTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    await runPromise(
      pipe(
        generateBadgesEffect(),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(readFileStringMock).toHaveBeenCalledWith(defaultSummaryPath, 'utf8');
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
  });

  it('should use custom summary path and output dir', async () => {
    const summaryPath = './cool';
    const outputDir = './yolo';
    const files = ['one.svg', 'apps/front/cool.svg'];

    const {
      FsTestLayer,
      readFileStringMock,
      existsMock,
      readDirectoryMock,
      removeMock,
    } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readDirectory: Effect.succeed(files),
      readFileString: Effect.succeed('{}'),
      remove: Effect.void,
    });
    const { ConsoleTestLayer } = makeConsoleTestLayer({});
    const { HttpClientTestLayer } = makeHttpClientTestLayer({});

    await runPromise(
      pipe(
        generateBadgesEffect(summaryPath, outputDir, defaultIcon),
        Effect.scoped,
        Effect.provide(
          Layer.mergeAll(FsTestLayer, ConsoleTestLayer, HttpClientTestLayer),
        ),
      ),
    );

    expect(readFileStringMock).toHaveBeenCalledWith(summaryPath, 'utf8');

    expect(generateCoverageFile).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith(outputDir);
    expect(readDirectoryMock).toHaveBeenCalledWith(outputDir);
    expect(removeMock).toHaveBeenCalledTimes(2);
    expect(removeMock).toHaveBeenNthCalledWith(1, `${outputDir}/${files[0]}`);
    expect(removeMock).toHaveBeenNthCalledWith(2, `${outputDir}/${files[1]}`);
    expect(generateCoverageFile).toHaveBeenCalledWith(
      expect.anything(),
      outputDir,
      expect.anything(),
    );
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
  });
});
