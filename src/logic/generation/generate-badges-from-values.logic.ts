import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import { defaultIcon, defaultLabelPrefix, defaultOutputDir } from '@constants';
import { ConsoleLive } from '@effects/console';

import {
  type CoverageSummaryValue,
  generateBadgesFromValuesEffect as program,
} from './effects/generate-badges-from-values-effect.logic.js';

export const generateBadgesFromValuesEffect = (
  summaryValues: CoverageSummaryValue,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
  labelPrefix = defaultLabelPrefix,
) =>
  pipe(
    program(summaryValues, outputPath, logo, labelPrefix),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(NodeFileSystem.layer, FetchHttpClient.layer, ConsoleLive),
    ),
  );

export const generateBadgesFromValues = async (
  summaryValues: CoverageSummaryValue,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
  labelPrefix = defaultLabelPrefix,
) =>
  Effect.runPromise(
    generateBadgesFromValuesEffect(
      summaryValues,
      outputPath,
      logo,
      labelPrefix,
    ),
  );
