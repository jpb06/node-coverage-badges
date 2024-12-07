import { summaryKeys } from '@constants';
import type { CoverageKeysWithTotal, CoverageSummaryFileContent } from '@types';
import { Effect, pipe } from 'effect';

import { Console } from '@effects/console';

const getTotalPercentage = (summary: CoverageSummaryFileContent) => {
  const result =
    summaryKeys
      .map((k) => summary.total[k].pct ?? 0)
      .reduce((a, b) => a + b, 0) / summaryKeys.length;

  return Math.round((result + Number.EPSILON) * 100) / 100;
};

export const getPercentage = (
  summary: CoverageSummaryFileContent,
  key: CoverageKeysWithTotal,
) =>
  pipe(
    Effect.gen(function* () {
      if (key === 'total') {
        return getTotalPercentage(summary);
      }

      const value = summary.total[key].pct;
      if (value === undefined) {
        const { info } = yield* Console;

        info(`No value for key '${key}' found in coverage report`);
      }
      return value;
    }),
    Effect.withSpan('get-percentage', {
      attributes: {
        summary,
        key,
      },
    }),
  );
