import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

export const ensureDirEffect = (path: string) =>
  pipe(
    Effect.gen(function* () {
      const { exists, makeDirectory } = yield* FileSystem;

      const pathExists = yield* exists(path);
      if (pathExists) {
        return;
      }

      yield* makeDirectory(path, {
        recursive: true,
      });
    }),
    Effect.withSpan('ensure-dir', {
      attributes: {
        path,
      },
    }),
  );
