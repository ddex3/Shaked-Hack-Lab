import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }
    next();
  };
}
