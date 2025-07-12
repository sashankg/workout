import { createContext, PropsWithChildren, use } from "react";

const NameContext = createContext<string>("");

interface NameContextProviderProps extends PropsWithChildren {
  name?: string;
}

export function NameContextProvider({
  children,
  name,
}: NameContextProviderProps) {
  if (!name) return children;
  const prefix = use(NameContext);
  return (
    <NameContext.Provider value={prefix ? `${prefix}.${name}` : name}>
      {children}
    </NameContext.Provider>
  );
}

export function useInputName(name: undefined): undefined;
export function useInputName(name: string): string;
export function useInputName(name: string | undefined): string | undefined;
export function useInputName(name: string | undefined): string | undefined {
  if (!name) return;
  const prefix = use(NameContext);
  return prefix ? `${prefix}.${name}` : name;
}
