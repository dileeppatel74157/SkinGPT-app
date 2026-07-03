import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Server configuration error.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.status) {
    statusCode = err.status;
    message = err.message || message;
  }

  // Internal logging of detailed stacks (never expose this info to client)
  console.error(`[ERROR] [Path: ${req.path}] [Status: ${statusCode}] Message:`, err.message || err);
  if (err.stack && statusCode === 500) {
    console.error(`[ERROR STACK]`, err.stack);
  }

  res.status(statusCode).json({ error: message });
};
