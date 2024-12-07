import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { makeHttpClientTestLayer } from '@tests/layers';

import { downloadFileEffect } from './download.effect.js';

describe('Download file function', () => {
  it('should return the fetched data', async () => {
    const data = 'cool';
    const url =
      'https://raw.githubusercontent.com/jpb06/jpb06/refs/heads/master/README.md';

    const { HttpClientTestLayer } = makeHttpClientTestLayer({
      get: Effect.succeed({ text: Effect.succeed(data) }),
    });

    const result = await runPromise(
      pipe(
        downloadFileEffect(url),
        Effect.scoped,
        Effect.provide(HttpClientTestLayer),
      ),
    );

    expect(result).toBe(data);
  });
});
