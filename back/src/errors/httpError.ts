export class HttpError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(statusCode = 500, message = 'Internal Server Error', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
