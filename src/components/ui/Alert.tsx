import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  className?: string;
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function Alert({ children, variant = "info", className }: AlertProps) {
  const variantClasses = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  return (
    <div
      role="alert"
      className={cn("alert", variantClasses[variant], className)}
    >
      {children}
    </div>
  );
}

export function AlertDescription({
  children,
  className,
}: AlertDescriptionProps) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}
