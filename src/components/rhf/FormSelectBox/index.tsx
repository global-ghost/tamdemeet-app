import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import type { Props as SelectProps } from 'react-select';

type Option = {
  label: string;
  value: string | number;
};

export type FormSelectBoxProps = {
  name: string;
  label?: string;
  isMulti?: boolean;
  options: Option[];
} & Omit<SelectProps<Option, boolean>, 'name' | 'options' | 'isMulti'>;

const customStyles: SelectProps<Option, boolean>['styles'] = {
  control: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#444',
    color: 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#333',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#2563eb'
      : state.isFocused
        ? '#555'
        : 'transparent',
    color: 'white',
    cursor: 'pointer',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

export const FormSelectBox: React.FC<FormSelectBoxProps> = ({
  name,
  label,
  isMulti = false,
  className = '',
  options,
  ...props
}) => {
  const { control } = useFormContext();

  const getSelectedOptions = (
    value: string | number | Array<string | number> | null | undefined,
  ): Option | Option[] | null => {
    if (isMulti) {
      return options.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value),
      );
    }
    return options.find((opt) => opt.value === value) ?? null;
  };

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
        render={({ field }) => (
          <Select
            isClearable={false}
            inputId={name}
            ref={field.ref}
            styles={customStyles}
            isMulti={isMulti}
            options={options}
            value={getSelectedOptions(field.value)}
            onChange={(selected) => {
              if (isMulti) {
                field.onChange((selected as Option[]).map((opt) => opt.value));
              } else {
                field.onChange((selected as Option | null)?.value ?? null);
              }
            }}
            onBlur={field.onBlur}
            className={className}
            {...props}
          />
        )}
      />
    </div>
  );
};
