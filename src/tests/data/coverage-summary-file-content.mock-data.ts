import type { CoverageSummaryFileContent, FileCoverageTotal } from '@types';

export const coverageSummaryFileContentMock = (
  linesPct?: number,
  statementsPct?: number,
  branchesPct?: number,
  functionsPct?: number,
): CoverageSummaryFileContent => ({
  total: {
    lines: { pct: linesPct } as FileCoverageTotal,
    statements: { pct: statementsPct } as FileCoverageTotal,
    branches: { pct: branchesPct } as FileCoverageTotal,
    functions: { pct: functionsPct } as FileCoverageTotal,
  },
});
