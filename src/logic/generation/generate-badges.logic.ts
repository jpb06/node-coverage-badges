import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import { defaultIcon, defaultOutputDir, defaultSummaryPath } from '@constants';
import { ConsoleLive } from '@effects/console';
import { ensureDirEffect } from '@effects/fs/ensure-dir/index.js';
import { readJsonEffect } from '@effects/fs/read-json/index.js';
import { removeFilesEffect } from '@effects/fs/remove-files/index.js';
import { type CoverageSummaryFileContent, coverageKeysArray } from '@types';

import { generateCoverageFile } from './coverage-file/generate-coverage-file.logic.js';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
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

export const generateBadges = async (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    pipe(
      generateBadgesEffect(coverageSummaryPath, outputPath, logo),
      Effect.scoped,
      Effect.provide(
        Layer.mergeAll(
          NodeFileSystem.layer,
          FetchHttpClient.layer,
          ConsoleLive,
        ),
      ),
      Effect.withSpan('generate-badges', {
        attributes: {
          coverageSummaryPath,
          outputPath,
          logo,
        },
      }),
    ),
  );
