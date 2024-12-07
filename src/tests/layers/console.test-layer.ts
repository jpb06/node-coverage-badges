import { type Effect, Layer } from 'effect';
import { vi } from 'vitest';

import { Console, type ConsoleLayer } from '@effects/console';

type ConsoleTestLayerInput = {
  reportSuccess?: Effect.Effect<void>;
  reportFailure?: Effect.Effect<void>;
  reportError?: Effect.Effect<void>;
  info?: Effect.Effect<void>;
  error?: Effect.Effect<void>;
};

export const makeConsoleTestLayer = (input: ConsoleTestLayerInput) => {
  const errorMock = vi.fn().mockReturnValue(input.error);
  const infoMock = vi.fn().mockReturnValue(input.info);
  const reportSuccessMock = vi.fn().mockReturnValue(input.reportSuccess);
  const reportFailureMock = vi.fn().mockReturnValue(input.reportFailure);
  const reportErrorMock = vi.fn().mockReturnValue(input.reportError);

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
