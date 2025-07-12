import { ComponentProps } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { useInputName } from "./NameContext";

interface InputProps<T extends FieldValues>
  extends Omit<ComponentProps<"input">, "className"> {
  name?: string;
}

export default function Input<T extends FieldValues>({
  name: nameProp,
  ...props
}: InputProps<T>) {
  const { register } = useFormContext();
  const name = useInputName(nameProp);
  if (!name) return <input {...props} className="border-b" />;
  if (
    name ===
    "workout.exercises.0.workout.exercises.0.exerciseDetails.2.setNumber"
  )
    debugger;
  console.log(name);
  return (
    <input {...props} {...register(name)} className="border-b" name={name} />
  );
}
