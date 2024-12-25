import { Request, Response, NextFunction } from "express";
import { z } from "zod";

interface ValidateRequestProps {
  body?: z.Schema;
  query?: z.Schema;
}

export default function validateRequest({
  body,
  query,
}: ValidateRequestProps) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      body?.parse(req.body);
      query?.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}
