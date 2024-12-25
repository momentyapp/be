import { Request, Response, NextFunction } from "express";

export default function parseJSON(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (e) {}
      }
    }

    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        try {
          req.query[key] = JSON.parse(req.query[key]);
        } catch (e) {}
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}
