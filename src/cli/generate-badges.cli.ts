#!/usr/bin/env node

import { FetchHttpClient } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';

import { Console, ConsoleLive } from '@effects/console';

import { generateBadgesEffect } from '../logic/generation/generate-badges.logic.js';
import { validateArguments } from './args/validate-arguments.js';

/* istanbul ignore file */

runPromise(
  pipe(
    Effect.gen(function* () {
      const { reportSuccess, reportError } = yield* Console;
      try {
        const { coverageSummaryPath, outputPath, logo } = validateArguments();

        yield* generateBadgesEffect(coverageSummaryPath, outputPath, logo);

        yield* reportSuccess(coverageSummaryPath);
        process.exit(0);
      } catch (err) {
        yield* reportError(err);
        process.exit(1);
      }
    }),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(NodeFileSystem.layer, FetchHttpClient.layer, ConsoleLive),
    ),
    Effect.withSpan('generate-badges-cli'),
  ),
);
