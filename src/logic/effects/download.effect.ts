import axios from 'axios';
import { Effect, pipe } from 'effect';

export class AxiosError {
  readonly _tag = 'axios-error';
  readonly message: string;
  readonly stack?: string;

  constructor(e: unknown, additionalMessage?: string) {
    this.message =
      e instanceof Error ? `${additionalMessage}\n${e.message}` : String(e);
    this.stack = e instanceof Error ? e.stack : '';
  }
}

export const download = (url: string) =>
  pipe(
    Effect.tryPromise({
      try: () => axios.get<string>(url),
      catch: (e) => new AxiosError(e, `Unable to retrieve data from ${url}`),
    }),
    Effect.map((response) => response.data),
  );
