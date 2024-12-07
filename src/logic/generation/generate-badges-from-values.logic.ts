import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import { defaultIcon, defaultOutputDir } from '@constants';
import { ConsoleLive } from '@effects/console';
import { ensureDirEffect } from '@effects/fs/ensure-dir/index.js';
import { removeFilesEffect } from '@effects/fs/remove-files/index.js';
import { coverageKeysArray } from '@types';

import { generateCoverageFile } from './coverage-file/generate-coverage-file.logic.js';

export interface CoverageSummaryValue {
  total: {
    lines: { pct: number };
    statements: { pct: number };
    functions: { pct: number };
    branches: { pct: number };
  };
}

export const generateBadgesFromValuesEffect = (
  summaryValues: CoverageSummaryValue,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  pipe(
    Effect.gen(function* () {
      yield* Effect.all([
        ensureDirEffect(outputPath),
        removeFilesEffect(outputPath, '.svg'),
      ]);

      yield* Effect.all(
        [...coverageKeysArray, 'total' as const].map(
          generateCoverageFile(summaryValues, outputPath, logo),
        ),
        { concurrency: 'unbounded' },
      );

      return true;
    }),
    Effect.withSpan('generate-badges-from-values-effect', {
      attributes: { summaryValues, outputPath, logo },
    }),
  );

export const generateBadgesFromValues = async (
  summaryValues: CoverageSummaryValue,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    pipe(
      generateBadgesFromValuesEffect(summaryValues, outputPath, logo),
      Effect.scoped,
      Effect.provide(
        Layer.mergeAll(
          NodeFileSystem.layer,
          FetchHttpClient.layer,
          ConsoleLive,
        ),
      ),
      Effect.withSpan('generate-badges-from-values', {
        attributes: {
          summaryValues,
          outputPath,
          logo,
        },
      }),
    ),
  );
