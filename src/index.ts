/* istanbul ignore file */
import type { CoverageSummary, FileCoverageTotal } from '@types';
import {
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
} from './logic/generation/generate-badges-from-values.logic.js';
import {
  generateBadges,
  generateBadgesEffect,
} from './logic/generation/generate-badges.logic.js';

export {
  generateBadges,
  generateBadgesEffect,
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
};
export type { CoverageSummary, FileCoverageTotal };
