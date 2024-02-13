export const coverageKeysArray = [
  'total',
  'lines',
  'statements',
  'functions',
  'branches',
] as const;

export type CoverageKeys = (typeof coverageKeysArray)[number];
export type TotalCoverageKey = (typeof coverageKeysArray)[0];
