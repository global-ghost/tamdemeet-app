import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (formData: T) => void;
  className?: string;
};

export const Form = <T extends FieldValues>({
  children,
  onSubmit,
  form,
  className,
}: PropsWithChildren<Props<T>>) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  return (
    <FormProvider {...form}>
      <div
        className={classNames(className, {
          'opacity-50 pointer-events-none': isSubmitting,
        })}
      >
        <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
      </div>
    </FormProvider>
  );
};
