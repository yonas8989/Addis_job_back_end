export {};

declare global {
  namespace Express {
    interface Request {
      admin: object; // Custom property for storing admin-related data
      user?: {
        id: string;
        // Add other user properties you use
        role?: string;
      };
      value: object; // Custom property for storing validation-related data
    }
  }
}
