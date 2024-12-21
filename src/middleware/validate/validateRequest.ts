import { Request, Response, NextFunction } from "express";
import { z } from "zod";

interface ValidateRequestProps {
  body?: z.Schema;
  query?: z.Schema;
  params?: z.Schema;
}

export default function validateRequest({
  body,
  query,
  params,
}: ValidateRequestProps) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      body?.parse(req.body);
      query?.parse(req.query);
      params?.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}
