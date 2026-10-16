/**
 * Error carrying an HTTP status and a safe, client-facing message.
 * Thrown anywhere in the request lifecycle and rendered by the central
 * error handler in app.js.
 */
export class HttpError extends Error {
  constructor(status, message, details = undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.publicMessage = message;
    if (details) this.details = details;
  }
}

export const badRequest = (msg = 'Bad request', details) => new HttpError(400, msg, details);
export const unauthorized = (msg = 'Not authenticated') => new HttpError(401, msg);
export const forbidden = (msg = 'Not allowed') => new HttpError(403, msg);
export const notFound = (msg = 'Not found') => new HttpError(404, msg);
export const conflict = (msg = 'Conflict', details) => new HttpError(409, msg, details);
export const unprocessable = (msg = 'Validation failed', details) => new HttpError(422, msg, details);

export default HttpError;
