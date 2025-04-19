import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function Label({ children, htmlFor, className }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn("label", className)}>
      <span className="label-text">{children}</span>
    </label>
  );
}
