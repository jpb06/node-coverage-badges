import { Effect, pipe } from 'effect';

import { defaultOutputDir, defaultSummaryPath, defaultIcon } from '@constants';
import { coverageKeysArray, CoverageSummaryFileContent } from '@types';

import {
  removeFiles,
  ensureDir,
  readJson,
} from '@logic/effects/fsExtra.effects';

import { generateCoverageFile } from './generateCoverageFile.logic';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  pipe(
    Effect.all([ensureDir(outputPath), removeFiles(outputPath, '.svg')]),
    Effect.flatMap(() =>
      readJson<CoverageSummaryFileContent>(coverageSummaryPath),
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

export const generateBadges = async (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    generateBadgesEffect(coverageSummaryPath, outputPath, logo),
  );
