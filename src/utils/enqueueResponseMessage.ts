import { DEFAULT_ERROR_MESSAGE } from 'actions/response';
import { enqueueSnackbar } from 'notistack';
import type { ErrorResponse, SuccessResponse } from 'actions/response';

export const enqueueResponseMessage = <S = undefined>(
  response: SuccessResponse<S> | null,
) => {
  if (response?.message) {
    enqueueSnackbar({ message: response.message, variant: 'success' });
  }
};

export const enqueueReponseError = <E = undefined>(error: ErrorResponse<E>) => {
  enqueueSnackbar({
    message: error.message ?? DEFAULT_ERROR_MESSAGE,
    variant: 'error',
  });
};
