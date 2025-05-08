import { Effect, pipe } from 'effect';

import { defaultIcon, defaultLabelPrefix, defaultOutputDir } from '@constants';
import { ensureDirEffect } from '@effects/fs/ensure-dir/index.js';
import { removeFilesEffect } from '@effects/fs/remove-files/index.js';
import { coverageKeysArray } from '@types';

import { generateCoverageFile } from '../coverage-file/generate-coverage-file.logic.js';

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
  labelPrefix = defaultLabelPrefix,
) =>
  pipe(
    Effect.gen(function* () {
      yield* Effect.all([
        ensureDirEffect(outputPath),
        removeFilesEffect(outputPath, '.svg'),
      ]);

      yield* Effect.all(
        [...coverageKeysArray, 'total' as const].map(
          generateCoverageFile(summaryValues, outputPath, logo, labelPrefix),
        ),
        { concurrency: 'unbounded' },
      );

      return true;
    }),
    Effect.withSpan('generate-badges-from-values-effect', {
      attributes: { summaryValues, outputPath, logo, labelPrefix },
    }),
  );
