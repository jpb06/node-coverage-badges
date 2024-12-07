import { FileSystem } from '@effect/platform/FileSystem';
import { type Effect, Layer } from 'effect';
import { TaggedError } from 'effect/Data';
import { vi } from 'vitest';

export class FsTestLayerError extends TaggedError('fs-test-layer-error')<{
  cause?: unknown;
  message?: string;
}> {}

type FsTestLayerInput = {
  exists?: Effect.Effect<boolean> | Effect.Effect<never, FsTestLayerError>;
  readDirectory?: Effect.Effect<string[]>;
  readFileString?: Effect.Effect<string>;
  remove?: Effect.Effect<void>;
  makeDirectory?: Effect.Effect<void>;
  writeFileString?: Effect.Effect<void>;
};

export const makeFsTestLayer = (input: FsTestLayerInput) => {
  const existsMock = vi.fn().mockReturnValue(input.exists);
  const readDirectoryMock = vi.fn().mockReturnValue(input.readDirectory);
  const readFileStringMock = vi.fn().mockReturnValue(input.readFileString);
  const removeMock = vi.fn().mockReturnValue(input.remove);
  const makeDirectoryMock = vi.fn().mockReturnValue(input.makeDirectory);
  const writeFileStringMock = vi.fn().mockReturnValue(input.writeFileString);

  const make: Partial<FileSystem> = {
    exists: existsMock,
    readDirectory: readDirectoryMock,
    readFileString: readFileStringMock,
    remove: removeMock,
    makeDirectory: makeDirectoryMock,
    writeFileString: writeFileStringMock,
  };

  return {
    FsTestLayer: Layer.succeed(FileSystem, FileSystem.of(make as never)),
    existsMock,
    readDirectoryMock,
    readFileStringMock,
    removeMock,
    makeDirectoryMock,
    writeFileStringMock,
  };
};
