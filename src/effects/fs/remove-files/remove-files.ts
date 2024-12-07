import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

export const removeFilesEffect = (path: string, extension: string) =>
  pipe(
    Effect.gen(function* () {
      const { readDirectory, remove } = yield* FileSystem;

      const files = yield* readDirectory(path);

      const removeEffects = files
        .filter((file) => file.endsWith(extension))
        .map((file) => remove(`${path}/${file}`));

      return yield* Effect.all(removeEffects, { concurrency: 'unbounded' });
    }),
    Effect.withSpan('remove-files', {
      attributes: {
        path,
        extension,
      },
    }),
  );
