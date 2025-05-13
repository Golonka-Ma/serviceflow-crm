import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

interface MetricBadgeProps {
  value: string | number;
  trend?: "up" | "down" | "neutral";
  label?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function MetricBadge({
  value,
  trend,
  label,
  variant = "default",
  size = "md",
  className,
  showIcon = true,
}: MetricBadgeProps) {
  // Variant styling
  const variantClasses = {
    default: "bg-base-200 text-base-content dark:bg-base-300",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
  };

  // Size styling
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-sm px-2.5 py-1 rounded-md",
    lg: "text-base px-3 py-1.5 rounded-md",
  };

  // Determine icon based on trend
  const IconComponent =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {showIcon && trend && IconComponent && (
        <IconComponent
          className={cn(
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5",
            "flex-shrink-0"
          )}
        />
      )}
      <span>{value}</span>
      {label && <span className="opacity-80">{label}</span>}
    </div>
  );
}

interface MetricBadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricBadgeGroup({
  children,
  className,
}: MetricBadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
  );
}
