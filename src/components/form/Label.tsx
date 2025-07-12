import classNames from "classnames";
import { ComponentProps, ReactNode } from "react";

interface LabelProps extends ComponentProps<"label"> {
  text: ReactNode;
}

export default function Label({
  children,
  text,
  className,
  ...props
}: LabelProps) {
  return (
    <label {...props} className={classNames("ds", className)}>
      <span className="font-semibold text-xs">{text}</span>
      {children}
    </label>
  );
}
