import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { HttpError } from '../errors/httpError';

type Validator = ((data: unknown) => unknown | Promise<unknown>) | ZodSchema<any>;

const isZodSchema = (v: unknown): v is ZodSchema<any> =>
  typeof v === 'object' && v !== null && typeof (v as any).parse === 'function';

export const validateDto = (validator: Validator): RequestHandler => {
  if (!validator) {
    throw new Error('validateDto requires a validator (function or Zod schema)');
  }

  return (req: Request, _res: Response, next: NextFunction) => {
    const runValidation = (): Promise<unknown> => {
      try {
        if (isZodSchema(validator)) {
          // support parseAsync when available
          const parseResult = (validator as any).parseAsync
            ? (validator as any).parseAsync(req.body)
            : Promise.resolve((validator as any).parse(req.body));
          return parseResult;
        }

        // validator is a function
        const result = (validator as (d: unknown) => unknown)(req.body);
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    };

    runValidation()
      .then(() => next())
      .catch((err) => {
        if (err instanceof ZodError) {
          return next(new HttpError(400, 'Validation error', err.format()));
        }
        return next(err);
      });
  };
};

// alias pour compatibilité
export const validateDTO = validateDto;
