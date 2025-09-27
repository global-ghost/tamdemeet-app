import ReactCodeInput from 'react-code-input';
import { Controller, useFormContext } from 'react-hook-form';
import type { ReactCodeInputProps } from 'react-code-input';

type FormCodeFieldProps = {
  name: string;
} & ReactCodeInputProps;

export const FormCodeField: React.FunctionComponent<FormCodeFieldProps> = ({
  name,
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <ReactCodeInput
          name={name}
          onChange={onChange}
          value={value}
          ref={ref}
          {...props}
        />
      )}
    />
  );
};
