import {
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form";
import { NameContextProvider } from "./NameContext";

interface ListInputProps<T extends FieldValues> {
  name: FieldArrayPath<T>;
  children: (
    field: FieldArrayWithId<T>,
    index: number,
    array: UseFieldArrayReturn<T>,
  ) => React.ReactNode;
  fieldsArray: UseFieldArrayReturn<T>;
}

export default function ListInput<T extends FieldValues>({
  name,
  children,
  fieldsArray,
}: ListInputProps<T>) {
  return fieldsArray.fields.map((field, index) => (
    <NameContextProvider name={`${name}.${index}`} key={field.id}>
      {children(field, index, fieldsArray)}
    </NameContextProvider>
  ));
}
