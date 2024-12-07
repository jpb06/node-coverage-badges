import { Effect, pipe } from 'effect';

import type { CoverageKeysWithTotal, CoverageSummaryFileContent } from '@types';

import { getBadgeColor } from './logic/badge-color.logic.js';
import { getPercentage } from './logic/coverage-percentage.logic.js';

export const getBadgeUrl = (
  summary: CoverageSummaryFileContent,
  key: CoverageKeysWithTotal,
  logo: string,
) =>
  pipe(
    Effect.gen(function* () {
      const percentage = yield* getPercentage(summary, key);
      if (percentage === undefined) {
        return undefined;
      }

      // https://shields.io/category/coverage
      const coverage = `${percentage}${encodeURI('%')}`;
      const colour = getBadgeColor(percentage);

      return `https://img.shields.io/badge/${key}-${coverage}-${colour}?logo=${logo}`;
    }),
    Effect.withSpan('get-badge-url', {
      attributes: {
        summary,
        key,
        logo,
      },
    }),
  );
