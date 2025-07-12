import { ComponentProps } from "react";
import classnames from "classnames";

export default function Button({
  className,
  ...props
}: ComponentProps<"button">) {
  return <button {...props} className={classnames("ds", className)} />;
}
