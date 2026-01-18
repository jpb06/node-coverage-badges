/* istanbul ignore file */

export type {
  CoverageSummary,
  CoverageSummaryFileContent,
  FileCoverageTotal,
} from '@types';

export {
  generateBadges,
  generateBadgesEffect,
} from './logic/generation/generate-badges.logic.js';
export {
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
} from './logic/generation/generate-badges-from-values.logic.js';
