import type { CoverageKeys } from './coverage-keys.type.js';
import type { FileCoverageTotal } from './file-coverage-total.type.js';

export type CoverageSummary = Record<CoverageKeys, FileCoverageTotal>;
