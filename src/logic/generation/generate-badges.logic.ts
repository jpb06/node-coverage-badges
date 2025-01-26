import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import { defaultIcon, defaultOutputDir, defaultSummaryPath } from '@constants';
import { ConsoleLive } from '@effects/console';

import { generateBadgesEffect as program } from './effects/generate-badges-effect.logic.js';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  pipe(
    program(coverageSummaryPath, outputPath, logo),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(NodeFileSystem.layer, FetchHttpClient.layer, ConsoleLive),
    ),
  );

export const generateBadges = async (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
) =>
  Effect.runPromise(
    generateBadgesEffect(coverageSummaryPath, outputPath, logo),
  );
