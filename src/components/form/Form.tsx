import classNames from "classnames";
import { ComponentProps } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
  formMethods: UseFormReturn<T>;
}

export default function Form<T extends FieldValues>({
  className,
  children,
  formMethods,
  onSubmit,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...formMethods}>
      <form
        {...props}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames("ds", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
