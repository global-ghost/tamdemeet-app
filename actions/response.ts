import { isRedirectError } from 'next/dist/client/components/redirect';

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong!';

export class CustomError<T = unknown> extends Error {
  statusCode: number;
  data: T | null;

  constructor(
    message: string = DEFAULT_ERROR_MESSAGE,
    statusCode: number = 500,
    data: T | null = null,
  ) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export type SuccessResponse<D = undefined> = [D] extends [undefined]
  ? {
      ok: true;
      message?: string;
      statusCode?: number;
    }
  : {
      ok: true;
      message?: string;
      statusCode?: number;
      data: D;
    };

export type ErrorResponse<D = undefined> = [D] extends [undefined]
  ? {
      ok: false;
      message?: string;
      statusCode?: number;
    }
  : {
      ok: false;
      message?: string;
      statusCode?: number;
      data?: D;
    };

export type Response<S = undefined, E = undefined> =
  | SuccessResponse<S>
  | ErrorResponse<E>;

export const isSuccessResponse = <T>(
  res: Response<T, unknown> | undefined,
): res is SuccessResponse<T> => !!res && res.ok === true;

export const handleServerError = (error: unknown) => {
  if (isRedirectError(error)) {
    throw error;
  }

  if (error instanceof CustomError) {
    return {
      ok: false,
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    };
  }

  console.error('Unexpected server error:', error);

  return {
    ok: false,
    data: undefined,
    message: 'Something went wrong!',
    statusCode: 500,
  };
};
