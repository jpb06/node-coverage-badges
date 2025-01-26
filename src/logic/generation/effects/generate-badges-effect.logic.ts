import { Effect, pipe } from 'effect';

import { ensureDirEffect } from '@effects/fs/ensure-dir/index.js';
import { readJsonEffect } from '@effects/fs/read-json/index.js';
import { removeFilesEffect } from '@effects/fs/remove-files/index.js';
import { type CoverageSummaryFileContent, coverageKeysArray } from '@types';

import { generateCoverageFile } from '../coverage-file/generate-coverage-file.logic.js';

export const generateBadgesEffect = (
  coverageSummaryPath: string,
  outputPath: string,
  logo: string,
) =>
  pipe(
    Effect.all([
      ensureDirEffect(outputPath),
      removeFilesEffect(outputPath, '.svg'),
    ]),
    Effect.flatMap(() =>
      readJsonEffect<CoverageSummaryFileContent>(coverageSummaryPath),
    ),
    Effect.flatMap((summary) =>
      Effect.all(
        [...coverageKeysArray, 'total' as const].map(
          generateCoverageFile(summary, outputPath, logo),
        ),
        { concurrency: 'unbounded' },
      ),
    ),
    Effect.map(() => true),
    Effect.withSpan('generateBadgesEffect', {
      attributes: { coverageSummaryPath, outputPath, logo },
    }),
  );
