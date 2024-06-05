import { Effect, pipe } from 'effect';
import { TaggedError } from 'effect/Data';
import {
  ensureDir as fsEnsureDir,
  readJson as fsReadJson,
  writeFile as fsWriteFile,
  readdir as fsReadDir,
  rm as fsRm,
} from 'fs-extra';

export class FsError extends TaggedError('fs-error')<{
  cause?: unknown;
  message?: string;
}> {}

export const ensureDir = (path: string) =>
  pipe(
    Effect.tryPromise({
      try: () => fsEnsureDir(path),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('ensureDir'),
  );

export const readDir = (path: string) =>
  pipe(
    Effect.tryPromise({
      try: () => fsReadDir(path),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('readDir'),
  );

export const rm = (path: string) =>
  pipe(
    Effect.tryPromise({
      try: () => fsRm(path),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('rm'),
  );

export const removeFiles = (path: string, extension: string) =>
  pipe(
    Effect.gen(function* () {
      const files = yield* readDir(path);

      const removeEffects = files
        .filter((file) => file.endsWith(extension))
        .map((file) => rm(`${path}/${file}`));

      return yield* Effect.all(removeEffects, { concurrency: 'unbounded' });
    }),
    Effect.withSpan('removeFiles'),
  );

export const readJson = <TResult>(path: string) =>
  pipe(
    Effect.tryPromise({
      try: () => fsReadJson(path) as Promise<TResult>,
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('readJson'),
  );

export const writeFile = (path: string, data: string) =>
  pipe(
    Effect.tryPromise({
      try: () => fsWriteFile(path, data, { encoding: 'utf8' }),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('writeFile'),
  );
