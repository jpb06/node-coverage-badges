import { CoverageKeys } from './coverageKeys.type';
import { FileCoverageTotal } from './fileCoverageTotal.type';

export type CoverageSummary = Record<CoverageKeys, FileCoverageTotal>;
