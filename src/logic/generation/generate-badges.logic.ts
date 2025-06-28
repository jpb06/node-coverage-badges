import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import {
  defaultDebug,
  defaultIcon,
  defaultLabelPrefix,
  defaultOutputDir,
  defaultSummaryPath,
} from '@constants';
import { ConsoleLive } from '@effects/console';

import { generateBadgesEffect as program } from './effects/generate-badges-effect.logic.js';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
  labelPrefix = defaultLabelPrefix,
  debug = defaultDebug,
) =>
  pipe(
    program(coverageSummaryPath, outputPath, logo, labelPrefix, debug),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(NodeFileSystem.layer, FetchHttpClient.layer, ConsoleLive),
    ),
  );

export const generateBadges = async (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
  labelPrefix = defaultLabelPrefix,
  debug = defaultDebug,
) =>
  Effect.runPromise(
    generateBadgesEffect(
      coverageSummaryPath,
      outputPath,
      logo,
      labelPrefix,
      debug,
    ),
  );
