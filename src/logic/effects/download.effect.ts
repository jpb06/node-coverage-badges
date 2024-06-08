import axios from 'axios';
import { Effect, pipe } from 'effect';
import { TaggedError } from 'effect/Data';

export class AxiosError extends TaggedError('axios-error')<{
  cause?: unknown;
  message?: string;
}> {}

export const download = (url: string) =>
  pipe(
    Effect.tryPromise({
      try: () => axios.get<string>(url),
      catch: (e) =>
        new AxiosError({
          cause: e,
          message: `Unable to retrieve data from ${url}`,
        }),
    }),
    Effect.map((response) => response.data),
    Effect.withSpan('download', { attributes: { url } }),
  );
