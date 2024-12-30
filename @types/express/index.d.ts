export {};

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      parsedQuery?: Record<string, any>;
    }
  }
}
