/**
 * A single field-level validation error as returned by the Freshdesk API in
 * the `errors` array of a 400 Bad Request response.
 *
 * Example wire shape:
 *   { "field": "priority", "message": "is not a valid value", "code": "invalid_value" }
 */
export interface FreshdeskFieldError {
  field?: string;
  message?: string;
  code?: string;
}

/** Base error for everything thrown by this SDK. */
export class FreshdeskError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
    public requestId?: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

/**
 * Alias for the documented base name `ServiceError`. The whole error hierarchy
 * descends from this class, so `instanceof ServiceError` matches any SDK error.
 */
export { FreshdeskError as ServiceError };

/** HTTP 401 — invalid or missing API key. */
export class AuthenticationError extends FreshdeskError {
  constructor(message: string, response?: unknown, requestId?: string) {
    super(message, 401, response, requestId);
  }
}

/** HTTP 403 — authenticated but not permitted to perform the action. */
export class ForbiddenError extends FreshdeskError {
  constructor(message: string, response?: unknown, requestId?: string) {
    super(message, 403, response, requestId);
  }
}

/** HTTP 404 — resource does not exist. */
export class NotFoundError extends FreshdeskError {
  constructor(message: string, response?: unknown, requestId?: string) {
    super(message, 404, response, requestId);
  }
}

/** HTTP 400 — validation failure. Carries the per-field `errors` array. */
export class ValidationError extends FreshdeskError {
  constructor(
    message: string,
    public errors: FreshdeskFieldError[] = [],
    response?: unknown,
    requestId?: string,
  ) {
    super(message, 400, response, requestId);
  }
}

/** HTTP 429 — per-account, per-minute rate limit exceeded. */
export class RateLimitError extends FreshdeskError {
  constructor(
    message: string,
    public retryAfter: number,
    response?: unknown,
    requestId?: string,
  ) {
    super(message, 429, response, requestId);
  }
}

/** HTTP 5xx — server-side failure. */
export class ServerError extends FreshdeskError {
  constructor(message: string, statusCode: number, response?: unknown, requestId?: string) {
    super(message, statusCode, response, requestId);
  }
}
