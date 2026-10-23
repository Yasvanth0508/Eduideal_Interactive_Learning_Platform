const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const ALL = UPPERCASE + LOWERCASE + DIGITS;

function getRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Generates a 10-character password without look-alike characters (no 0, O, o, 1, l, I).
 * Guaranteed to include at least one uppercase letter, one lowercase letter, and one digit.
 */
export function generatePassword(): string {
  const chars: string[] = [
    UPPERCASE[getRandomInt(UPPERCASE.length)],
    LOWERCASE[getRandomInt(LOWERCASE.length)],
    DIGITS[getRandomInt(DIGITS.length)],
  ];

  for (let i = 3; i < 10; i++) {
    chars.push(ALL[getRandomInt(ALL.length)]);
  }

  // Fisher-Yates shuffle using crypto.getRandomValues
  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    const temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }

  return chars.join("");
}
