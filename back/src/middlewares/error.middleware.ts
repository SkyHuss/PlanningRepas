import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // logging minimal (remplacer par logger si besoin)
  console.error(err);

  if (err instanceof HttpError) {
    res
      .status(err.statusCode)
      .json({ error: err.message, ...(err.details ? { details: err.details } : {}) });
    return;
  }

  const anyErr = err as any;

  // Mapper erreurs Postgres / TypeORM courantes
  if (anyErr?.code === '23505') {
    // violation unique
    res.status(409).json({ error: 'Conflict', details: anyErr.detail ?? anyErr.message });
    return;
  }

  if (anyErr?.name === 'QueryFailedError') {
    res.status(400).json({ error: 'Database error', details: anyErr.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
