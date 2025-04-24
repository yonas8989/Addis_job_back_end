import { generate } from "otp-generator";

/**
 * Generates a 4-digit OTP.
 * @returns {string} - The generated OTP.
 */
export const generateOtp = (): string => {
  return generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    digits: true,
    specialChars: false,
  });
};
