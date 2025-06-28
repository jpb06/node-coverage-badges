import { Effect, pipe } from 'effect';
import color from 'picocolors';

import { Console } from '@effects/console';
import type { CoverageKeysWithTotal, CoverageSummaryFileContent } from '@types';

import { getBadgeColor } from './logic/badge-color.logic.js';
import { getPercentage } from './logic/coverage-percentage.logic.js';
import { formatColor } from './logic/format-color.js';

export const getBadgeUrl = (
  summary: CoverageSummaryFileContent,
  key: CoverageKeysWithTotal,
  logo: string,
  labelPrefix: string,
  debug: boolean,
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

      const prefix = labelPrefix.endsWith(' ')
        ? labelPrefix
        : `${labelPrefix}: `;
      const label = encodeURI(`${prefix}${key}`);

      if (debug) {
        const { info } = yield* Console;

        yield* info(
          `🔹 Generating ${formatColor(colour)} badge for ${color.cyanBright(color.underline(key))} metric with value ${color.whiteBright(`[ ${percentage}% ]`)}.`,
        );
      }

      return `https://img.shields.io/badge/${label}-${coverage}-${colour}?logo=${logo}`;
    }),
    Effect.withSpan('get-badge-url', {
      attributes: {
        summary,
        key,
        logo,
      },
    }),
  );
