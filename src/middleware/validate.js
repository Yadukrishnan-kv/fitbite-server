import { ZodError } from 'zod';
import { unprocessable } from '../utils/httpError.js';

/**
 * Build a middleware that validates parts of the request against Zod schemas.
 * Parsed (and coerced) values replace the originals so handlers receive clean data.
 *
 *   validate({ body: loginSchema })
 *   validate({ params: idSchema, query: listQuerySchema })
 */
export function validate(schemas = {}) {
  return (req, _res, next) => {
    try {
      for (const key of ['body', 'query', 'params']) {
        if (schemas[key]) {
          req[key] = schemas[key].parse(req[key]);
        }
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          field: i.path.join('.') || '(root)',
          message: i.message,
        }));
        next(unprocessable('Validation failed', details));
        return;
      }
      next(err);
    }
  };
}

export default validate;
