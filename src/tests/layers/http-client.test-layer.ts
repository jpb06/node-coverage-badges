import { HttpClient } from '@effect/platform/HttpClient';
import { type Effect, Layer } from 'effect';
import { TaggedError } from 'effect/Data';
import { vi } from 'vitest';

export class HttpClientTestLayerError extends TaggedError(
  'http-client-test-layer-error',
)<{
  cause?: unknown;
  message?: string;
}> {}

type HttpClientTestLayerInput = {
  get?: Effect.Effect<{ text: Effect.Effect<string> }>;
};

export const makeHttpClientTestLayer = (input: HttpClientTestLayerInput) => {
  const getMock = vi.fn().mockReturnValue(input.get);

  const make: Partial<HttpClient> = {
    get: getMock,
  };

  return {
    HttpClientTestLayer: Layer.succeed(
      HttpClient,
      HttpClient.of(make as never),
    ),
    getMock,
  };
};
