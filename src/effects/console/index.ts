import { Context, Effect, Layer } from 'effect';
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
    Effect.succeed(
      console.info(
        `${colors.cyanBright('node-coverage-badges')} 🚀 - ${colors.greenBright(
          'Badges generated from summary path',
        )} ${colors.underline(colors.cyanBright(summaryPath))}`,
      ),
    ),
  reportFailure: (message: string) =>
    Effect.succeed(
      console.error(
        `${colors.cyanBright('node-coverage-badges')} ❌ - ${colors.redBright(message)}`,
      ),
    ),
  reportError: (error: unknown) =>
    Effect.sync(() => {
      let message = 'An unknown error occurred';
      if (error instanceof Error) {
        message = error.message;
      }

      console.error(
        `${colors.cyanBright('node-coverage-badges')} ❌ - ${colors.redBright(message)}`,
      );
    }),
  info: (message: string) => Effect.succeed(console.info(message)),
  error: (message: string) => Effect.succeed(console.error(message)),
});
