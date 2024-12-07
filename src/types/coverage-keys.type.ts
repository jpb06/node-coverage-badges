export const coverageKeysArray = [
  'lines',
  'statements',
  'functions',
  'branches',
] as const;

export type CoverageKeys = (typeof coverageKeysArray)[number];
export type CoverageKeysWithTotal = CoverageKeys | 'total';
export type TotalCoverageKey = (typeof coverageKeysArray)[0];
