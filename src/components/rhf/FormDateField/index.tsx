import type { InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type FormDateFieldProps = {
  name: string;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'>;

const formatDateTime = (date?: Date | string | null): string => {
  if (!date) {
    return '';
  }
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

export const FormDateField: React.FC<FormDateFieldProps> = ({
  name,
  label,
  className = '',
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label htmlFor={name} className='text-xs text-gray'>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <input
            id={name}
            type='datetime-local'
            ref={ref}
            value={formatDateTime(value)}
            onChange={(e) => {
              const stringValue = e.target.value;
              onChange(stringValue ? new Date(stringValue) : undefined);
            }}
            className={`rounded border bg-transparent px-3 py-2 text-white focus:outline-none
            focus:ring-2 focus:ring-primary disabled:border-disabled disabled:text-disabled
            ${className}`}
            {...props}
          />
        )}
      />
    </div>
  );
};
