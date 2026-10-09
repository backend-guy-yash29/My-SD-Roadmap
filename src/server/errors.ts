export type ErrorCode =
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string } };

/** Runs `fn` and turns AppErrors into a typed failure; anything else is rethrown. */
export async function toResult<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    if (err instanceof AppError)
      return { ok: false, error: { code: err.code, message: err.message } };
    throw err;
  }
}
