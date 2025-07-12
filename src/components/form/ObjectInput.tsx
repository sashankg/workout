import { PropsWithChildren } from "react";
import { NameContextProvider, useInputName } from "./NameContext";

interface ObjectInputProps extends PropsWithChildren {
  name: string;
}
export default function ObjectInput({ children, name }: ObjectInputProps) {
  return <NameContextProvider name={name}>{children}</NameContextProvider>;
}
