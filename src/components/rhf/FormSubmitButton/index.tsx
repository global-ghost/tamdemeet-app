import { Button } from '@components/ui';
import { useFormContext } from 'react-hook-form';
import type { ButtonProps } from '@components/ui';

type Props = Omit<ButtonProps, 'type'>;
export const FormSubmitButton: React.FunctionComponent<Props> = (props) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return <Button type='submit' {...props} loading={isSubmitting} />;
};
