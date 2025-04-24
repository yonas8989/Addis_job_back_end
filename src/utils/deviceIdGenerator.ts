import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique device ID by combining the user ID and a UUID.
 * @param {string} userId - The user ID to be included in the device ID.
 * @returns {string} - The generated device ID.
 */
export const deviceIdGenerator = (userId: string): string => {
  return `${userId}-${uuidv4()}`; // Combine user ID and UUID
};
