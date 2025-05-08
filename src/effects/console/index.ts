import { Context, Effect, Console as EffectConsole, Layer, pipe } from 'effect';
import colors from 'picocolors';

export class Console extends Context.Tag('Console')<
  Console,
  {
    readonly reportSuccess: (message: string) => Effect.Effect<void>;
    readonly reportFailure: (message: string) => Effect.Effect<void>;
    readonly reportError: (error: unknown) => Effect.Effect<void>;
    readonly info: (message: string) => Effect.Effect<void>;
    readonly error: (message: string) => Effect.Effect<void>;
  }
>() {}
export type ConsoleLayer = (typeof Console)['Service'];

export const ConsoleLive = Layer.succeed(Console, {
  reportSuccess: (summaryPath: string) =>
    pipe(
      EffectConsole.info(
        `${colors.cyanBright('node-coverage-badges')} 🚀 - ${colors.greenBright(
          'Badges generated from summary path',
        )} ${colors.underline(colors.cyanBright(summaryPath))}`,
      ),
      Effect.withSpan('console/report-success'),
    ),
  reportFailure: (message: string) =>
    pipe(
      EffectConsole.error(
        `${colors.cyanBright('node-coverage-badges')} ❌ - ${colors.redBright(message)}`,
      ),
      Effect.withSpan('console/report-failure'),
    ),
  reportError: (error: unknown) =>
    pipe(
      Effect.sync(() => {
        let message = 'An unknown error occurred';
        if (error instanceof Error) {
          message = error.message;
        }

        EffectConsole.error(
          `${colors.cyanBright('node-coverage-badges')} ❌ - ${colors.redBright(message)}`,
        );
      }),
      Effect.withSpan('console/report-error'),
    ),
  info: EffectConsole.info,
  error: EffectConsole.error,
});
