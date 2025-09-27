import type {
  ErrorResponse,
  Response,
  SuccessResponse,
} from 'actions/response';

export const handleAction = async <S, E>(
  callback: () => Promise<Response<S, E>>,
  onError: (error: ErrorResponse<E>) => Promise<void> | void,
  onSuccess?: (response: SuccessResponse<S>) => Promise<void> | void,
) => {
  try {
    const response = await callback();

    if (!onError && !onSuccess) {
      return response;
    }
    if (!response) {
      return;
    }

    if (onSuccess && response?.ok) {
      await onSuccess(response);
    }

    if (onError && !response?.ok) {
      await onError(response);
    }
  } catch (e) {
    if (onError) {
      return await onError({
        ok: false,
        message: 'An unexpected error occurred',
        statusCode: 500,
        data: e as E,
      } as ErrorResponse<E>);
    }
    return {
      ok: false,
      message: 'An unexpected error occurred',
      statusCode: 500,
      data: undefined,
    } as ErrorResponse<E>;
  }
};
