import { join } from 'node:path';

import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { Console } from '@effects/console';
import { downloadFileEffect } from '@effects/fetch';
import type { CoverageKeysWithTotal, CoverageSummaryFileContent } from '@types';

import { getBadgeUrl } from '../../badges/badge-url.logic.js';

export const generateCoverageFile =
  (summary: CoverageSummaryFileContent, outputPath: string, logo: string) =>
  (key: CoverageKeysWithTotal) =>
    pipe(
      Effect.gen(function* () {
        const { reportFailure } = yield* Console;
        const badgeUrl = yield* getBadgeUrl(summary, key, logo);
        if (!badgeUrl) {
          return yield* reportFailure(
            `generateCoverageFile: missing badgeUrl for ${key}`,
          );
        }

        const path = join(outputPath, `coverage-${key}.svg`);
        const file = yield* downloadFileEffect(badgeUrl);
        if (file.length > 0) {
          const { writeFileString } = yield* FileSystem;
          return yield* writeFileString(path, file);
        }

        yield* reportFailure(
          `generateCoverageFile: no file to write for ${key}`,
        );
      }),
      Effect.withSpan('generate-coverage-file', {
        attributes: {
          summary,
          outputPath,
          logo,
          key,
        },
      }),
    );
