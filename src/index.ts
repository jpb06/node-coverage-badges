/* istanbul ignore file */
import { CoverageSummary, FileCoverageTotal } from '@types';

import {
  generateBadges,
  generateBadgesEffect,
} from '@logic/generation/generateBadges.logic';

import { AxiosError } from './logic/effects/download.effect';
import { FsError } from './logic/effects/fsExtra.effects';

export { generateBadges, generateBadgesEffect, AxiosError, FsError };
export type { CoverageSummary, FileCoverageTotal };
