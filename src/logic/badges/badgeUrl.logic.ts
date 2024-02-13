import { CoverageKeys, CoverageSummaryFileContent } from '@types';

import { getPercentage } from '../data/coveragePercentage.logic';

import { getBadgeColor } from './badgeColor.logic';

export const getBadgeUrl = (
  summary: CoverageSummaryFileContent,
  key: CoverageKeys,
  logo: string,
): string | undefined => {
  const percentage = getPercentage(summary, key);
  if (percentage === undefined) {
    return undefined;
  }

  // https://shields.io/category/coverage
  const coverage = `${percentage}${encodeURI('%')}`;
  const colour = getBadgeColor(percentage);

  return `https://img.shields.io/badge/${key}-${coverage}-${colour}?logo=${logo}`;
};
