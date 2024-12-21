import { Request, Response, NextFunction } from "express";

const exceptions: string[] = [];

export default function trimQueryString(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.query) {
    for (const key in req.query) {
      if (exceptions.includes(key)) continue;
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key].trim();
      }
    }
  }
  next();
}
