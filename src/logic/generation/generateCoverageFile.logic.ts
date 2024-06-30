import { join } from 'path';

import { Effect, pipe } from 'effect';

import { CoverageSummaryFileContent, CoverageKeysWithTotal } from '@types';

import { getBadgeUrl } from '@logic/badges/badgeUrl.logic';
import { download } from '@logic/effects/download.effect';
import { writeFile } from '@logic/effects/fsExtra.effects';

export const generateCoverageFile =
  (summary: CoverageSummaryFileContent, outputPath: string, logo: string) =>
  (key: CoverageKeysWithTotal) =>
    pipe(
      Effect.gen(function* (_) {
        const badgeUrl = getBadgeUrl(summary, key, logo);
        if (!badgeUrl) {
          console.error(`generateCoverageFile: missing badgeUrl for ${key}`);
          return;
        }

        const path = join(outputPath, `coverage-${key}.svg`);
        const file = yield* _(download(badgeUrl));
        if (file.length > 0) {
          yield* _(writeFile(path, file));
        } else {
          console.error(`generateCoverageFile: no file to write for ${key}`);
        }
      }),
      Effect.withSpan('generateCoverageFile', {
        attributes: {
          summary,
          outputPath,
          logo,
          key,
        },
      }),
    );
