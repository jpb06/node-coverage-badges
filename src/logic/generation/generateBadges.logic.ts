import { Effect, pipe } from 'effect';

import { defaultOutputDir, defaultSummaryPath, defaultIcon } from '@constants';
import { coverageKeysArray, CoverageSummaryFileContent } from '@types';

import { emptyDir, ensureDir, readJson } from '@logic/effects/fsExtra.effects';

import { generateCoverageFile } from './generateCoverageFile.logic';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  pipe(
    Effect.all([ensureDir(outputPath), emptyDir(outputPath)]),
    Effect.flatMap(() =>
      readJson<CoverageSummaryFileContent>(coverageSummaryPath),
    ),
    Effect.flatMap((summary) =>
      Effect.all(
        coverageKeysArray.map(generateCoverageFile(summary, outputPath, logo)),
        { concurrency: 'unbounded' },
      ),
    ),
    Effect.map(() => true),
  );

export const generateBadges = async (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    generateBadgesEffect(coverageSummaryPath, outputPath, logo),
  );
