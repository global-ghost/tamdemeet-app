import { Button } from '@components/ui';
import { useToggle } from '@utils/useToggle';
import classNames from 'classnames';
import { Controller, useFormContext } from 'react-hook-form';

type FormTextFieldProps = {
  label: string;
  required?: boolean;
  name: string;
  type?: 'text' | 'password';
  disabled?: boolean;
};

export const FormTextField: React.FunctionComponent<FormTextFieldProps> = ({
  name,
  label,
  required,
  disabled,
  type = 'text',
}) => {
  const { isOpen: isPasswordType, toggle } = useToggle();
  const { control } = useFormContext();

  const inputLabel = `${label} ${required ? '*' : ''}`;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <div
          className={classNames({
            'opacity-50 pointer-events-none': disabled,
          })}
        >
          <p className='min-h-4 text-xs text-gray'>{value && inputLabel}</p>
          <div
            className={classNames(
              'relative flex items-center border-b min-h-5',
              {
                'focus-within:border-white': !error,
                'border-error': error,
                'border-gray': !error,
              },
            )}
          >
            <input
              className='w-full border-none bg-transparent outline-none placeholder:opacity-100'
              placeholder={inputLabel}
              id={name}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              ref={ref}
              type={isPasswordType ? 'text' : type}
            />
            {type === 'password' && (
              <Button
                onClick={toggle}
                variant='white'
                icon={isPasswordType ? 'eye-blocked' : 'eye'}
                className='absolute bottom-0 right-0'
              />
            )}
          </div>
          <div className='min-h-3'>
            {error && <p className='text-sm text-error'>{error.message}</p>}
          </div>
        </div>
      )}
    />
  );
};
