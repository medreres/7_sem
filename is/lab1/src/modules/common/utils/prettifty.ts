const SPACER_LENGTH = 2;

export const prettify = (value: unknown): string =>
  JSON.stringify(value, null, SPACER_LENGTH);
