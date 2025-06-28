import { Effect, Layer } from 'effect';
import { vi } from 'vitest';

import { Console, type ConsoleLayer } from '@effects/console';

type ConsoleTestLayerInput = {
  reportSuccess?: Effect.Effect<void>;
  reportFailure?: Effect.Effect<void>;
  reportError?: Effect.Effect<void>;
  info?: Effect.Effect<void>;
  error?: Effect.Effect<void>;
};

export const makeConsoleTestLayer = ({
  error,
  info,
  reportError,
  reportFailure,
  reportSuccess,
}: ConsoleTestLayerInput) => {
  const errorMock = vi.fn().mockReturnValue(error ? error : Effect.void);
  const infoMock = vi.fn().mockReturnValue(info ? info : Effect.void);
  const reportSuccessMock = vi
    .fn()
    .mockReturnValue(reportSuccess ? reportSuccess : Effect.void);
  const reportFailureMock = vi
    .fn()
    .mockReturnValue(reportFailure ? reportFailure : Effect.void);
  const reportErrorMock = vi
    .fn()
    .mockReturnValue(reportError ? reportError : Effect.void);

  const make: Partial<ConsoleLayer> = {
    error: errorMock,
    info: infoMock,
    reportSuccess: reportSuccessMock,
    reportFailure: reportFailureMock,
    reportError: reportErrorMock,
  };

  return {
    ConsoleTestLayer: Layer.succeed(Console, Console.of(make as never)),
    errorMock,
    infoMock,
    reportErrorMock,
    reportFailureMock,
    reportSuccessMock,
  };
};
