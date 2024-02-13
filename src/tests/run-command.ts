export const runCommand = async (
  validationFilePath: string,
  ...args: string[]
) => {
  process.argv = [
    'node', // Not used but a value is required at this index in the array
    'cli.js', // Not used but a value is required at this index in the array
    ...args,
  ];

  const { validateArguments } = await import(validationFilePath);

  return validateArguments();
};
