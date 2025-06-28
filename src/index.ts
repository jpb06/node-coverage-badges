/* istanbul ignore file */
import type { CoverageSummary, FileCoverageTotal } from '@types';

import {
  generateBadges,
  generateBadgesEffect,
} from './logic/generation/generate-badges.logic.js';
import {
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
} from './logic/generation/generate-badges-from-values.logic.js';

export {
  generateBadges,
  generateBadgesEffect,
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
};
export type { CoverageSummary, FileCoverageTotal };
