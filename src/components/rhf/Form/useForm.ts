// eslint-disable-next-line no-restricted-imports
import { useForm as useReactHookForm } from 'react-hook-form';

export const useForm: typeof useReactHookForm = (props) => {
  return useReactHookForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    ...props,
  });
};
