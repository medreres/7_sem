export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 64;
export const PASSWORD_LENGTH_ERROR = `Password length must be withing range ${MIN_PASSWORD_LENGTH}, ${MAX_PASSWORD_LENGTH}`;
export const PASSWORD_REGEX_ERROR = `Should contain at least one special character, one uppercase letter, one lowercase letter, and one number and minimum length ${MIN_PASSWORD_LENGTH}`;
/**
 * ^(?=.*[A-Z]): Asserts that there is at least one uppercase letter.
 * (?=.*[a-z]): Asserts that there is at least one lowercase letter.
 * (?=.*\d): Asserts that there is at least one digit.
 * (?=.*[!@#$%^&*(),.?":{}|<>]): Asserts that there is at least one special character.
 * .{8,}$: Ensures the string is at least 8 characters long (you can adjust this length as needed).
 */
export const PASSWORD_VALIDATION_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

/**
 * ^: Ensures the match starts at the beginning of the string.
 * [A-Z]{1,2}: Matches 1 or 2 uppercase letters (e.g., A or AB).
 * [0-9R]: Matches a digit (0-9) or the letter R.
 * [0-9A-Z]?: Optionally matches a digit or uppercase letter (e.g., 5, C, or nothing).
 * ?: Optionally matches a space.
 * [0-9]: Matches a single digit (e.g., 4).
 * [A-Z]{2}: Matches exactly 2 uppercase letters (e.g., AA, XY).
 */
export const POSTAL_CODE_REGEX =
  /^([a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? ?[0-9][a-zA-Z]{2})/;

export const RESET_PASSWORD_CODE_LENGTH = 6;

// eslint-disable-next-line no-magic-numbers -- one year in ms
export const ONE_YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
