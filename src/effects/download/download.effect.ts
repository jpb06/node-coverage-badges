import { HttpClient } from '@effect/platform';
import { Effect, pipe } from 'effect';

export const downloadFileEffect = (url: string) =>
  pipe(
    HttpClient.HttpClient,
    Effect.flatMap((http) => http.get(url)),
    Effect.flatMap((response) => response.text),
    Effect.withSpan('download-file', { attributes: { url } }),
  );
