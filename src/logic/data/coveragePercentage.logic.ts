import { summaryKeys } from '@constants';
import { CoverageSummaryFileContent, CoverageKeysWithTotal } from '@types';

const getTotalPercentage = (summary: CoverageSummaryFileContent): number => {
  const result =
    summaryKeys
      .map((k) => summary.total[k].pct ?? 0)
      .reduce((a, b) => a + b, 0) / summaryKeys.length;

  return Math.round((result + Number.EPSILON) * 100) / 100;
};

export const getPercentage = (
  summary: CoverageSummaryFileContent,
  key: CoverageKeysWithTotal,
): number | undefined => {
  if (key === 'total') {
    return getTotalPercentage(summary);
  }

  const value = summary.total[key].pct;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.info(`No value for key '${key}' found in coverage report`);
  }
  return value;
};
