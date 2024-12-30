import { Request, Response, NextFunction } from "express";
import { z } from "zod";

interface ValidateRequestProps {
  body?: z.Schema;
  query?: z.Schema;
}

export default function validateRequest({ body, query }: ValidateRequestProps) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      body?.parse(req.body);
      if (query !== undefined) {
        const parsedQuery: Record<string, any> = {};
        for (const key in req.query) {
          const value = req.query[key];
          try {
            if (typeof value === "string") parsedQuery[key] = JSON.parse(value);
          } catch (error) {
            parsedQuery[key] = value;
          }
        }

        query.parse(parsedQuery);
        req.parsedQuery = parsedQuery;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
