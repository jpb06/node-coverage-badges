import { CoverageKeys } from './coverageKeys.type';
import { FileCoverageTotal } from './fileCoverageTotal.type';

export type CoverageSummary = Record<
  Exclude<CoverageKeys, 'jest coverage'>,
  FileCoverageTotal
>;
