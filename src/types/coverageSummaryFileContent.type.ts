import { CoverageSummary } from './coverageSummary.type';

export interface CoverageSummaryFileContent {
  [file: string]: CoverageSummary;
  total: CoverageSummary;
}
