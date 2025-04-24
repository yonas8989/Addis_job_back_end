import { hashSync } from "bcryptjs";

/**
 * Hashes the provided payload using bcrypt with a salt round of 12.
 * @param {string} payload - The data to be hashed.
 * @returns {string} - The hashed result.
 */
export const hashPayload = (payload: string): string => {
  return hashSync(payload, 12);
};
