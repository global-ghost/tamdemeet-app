import type { InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type FormCheckboxProps = {
  name: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormCheckbox: React.FunctionComponent<FormCheckboxProps> = ({
  name,
  label,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <input
              type='checkbox'
              id={name}
              name={name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              ref={ref}
              className='peer size-6 cursor-pointer appearance-none border-2 border-primary bg-card
                text-center text-sm checked:border-primary checked:bg-card focus:outline-none'
              {...props}
            />

            <div
              className='pointer-events-none absolute left-[5px] top-[-4px] z-0 hidden text-[20px]
                font-bold text-primary peer-checked:block'
            >
              ✓
            </div>
          </div>
          {label && (
            <label
              htmlFor={name}
              className='cursor-pointer text-sm font-medium text-primary'
            >
              {label}
            </label>
          )}
        </div>
      )}
    />
  );
};
