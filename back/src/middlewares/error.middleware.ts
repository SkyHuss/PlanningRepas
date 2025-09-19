import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // si une réponse a déjà été démarrée, déléguer à Express (évite double send)
  if (res.headersSent) {
    console.error('Headers already sent, delegating to default handler', err);
    return next(err as any);
  }

  console.error(err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message, ...(err.details ? { details: err.details } : {}) });
    return;
  }

  const anyErr = err as any;
  if (anyErr?.code === '23505') {
    res.status(409).json({ error: 'Conflict', details: anyErr.detail ?? anyErr.message });
    return;
  }

  if (anyErr?.name === 'QueryFailedError') {
    res.status(400).json({ error: 'Database error', details: anyErr.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
