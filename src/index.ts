/* istanbul ignore file */
import { CoverageSummary, FileCoverageTotal } from '@types';

import {
  generateBadges,
  generateBadgesEffect,
} from '@logic/generation/generateBadges.logic';
import {
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
} from '@logic/generation/generateBadgesFromValues.logic';

import { AxiosError } from './logic/effects/download.effect';
import { FsError } from './logic/effects/fsExtra.effects';

export {
  generateBadges,
  generateBadgesEffect,
  generateBadgesFromValues,
  generateBadgesFromValuesEffect,
  AxiosError,
  FsError,
};
export type { CoverageSummary, FileCoverageTotal };
