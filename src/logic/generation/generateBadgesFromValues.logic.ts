import { Effect, pipe } from 'effect';

import { defaultOutputDir, defaultIcon } from '@constants';
import { coverageKeysArray } from '@types';

import { removeFiles, ensureDir } from '@logic/effects/fsExtra.effects';

import { generateCoverageFile } from './generateCoverageFile.logic';

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
        ensureDir(outputPath),
        removeFiles(outputPath, '.svg'),
      ]);

      yield* Effect.all(
        [...coverageKeysArray, 'total' as const].map(
          generateCoverageFile(summaryValues, outputPath, logo),
        ),
        { concurrency: 'unbounded' },
      );

      return true;
    }),
    Effect.withSpan('generateBadgesFromValuesEffect', {
      attributes: { summaryValues, outputPath, logo },
    }),
  );

export const generateBadgesFromValues = async (
  summaryValues: CoverageSummaryValue,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    generateBadgesFromValuesEffect(summaryValues, outputPath, logo),
  );
