import { FetchHttpClient } from '@effect/platform';
import type { PlatformError } from '@effect/platform/Error';
import type { HttpClientError } from '@effect/platform/HttpClientError';
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
import type { JsonParsingError } from '@effects/fs/read-json/index.js';
import type { CoverageSummaryFileContent } from '@types';

import { generateBadgesEffect as program } from './effects/generate-badges-effect.logic.js';

export const generateBadgesEffect = (
  coverageSummaryPath = defaultSummaryPath,
  outputPath = defaultOutputDir,
  logo = defaultIcon,
  labelPrefix = defaultLabelPrefix,
  debug = defaultDebug,
): Effect.Effect<
  CoverageSummaryFileContent,
  PlatformError | JsonParsingError | HttpClientError,
  never
> =>
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
): Promise<CoverageSummaryFileContent> =>
  Effect.runPromise(
    generateBadgesEffect(
      coverageSummaryPath,
      outputPath,
      logo,
      labelPrefix,
      debug,
    ),
  );
