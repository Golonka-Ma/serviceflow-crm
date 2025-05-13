import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  className?: string;
  iconClassName?: string;
  valueColor?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  variant?: "default" | "primary";
  chartData?: Array<{ date: Date; value: number }>;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconClassName,
  valueColor = "default",
  variant = "default",
  chartData,
}: StatCardProps) {
  // Color mapping for value text (only for default variant)
  const valueColorClasses = {
    default: "text-base-content",
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  const isPrimaryVariant = variant === "primary";

  return (
    <div
      className={cn(
        "card border rounded-2xl shadow-md",
        "overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:border-opacity-50",
        isPrimaryVariant
          ? "bg-primary text-primary-content border-primary/50 dark:border-primary/80 hover:bg-primary/95"
          : "bg-base-100 border-base-300 dark:border-base-content/10 dark:bg-base-200 hover:bg-base-200/50 dark:hover:bg-base-200/10",
        className
      )}
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-3">
          <h3
            className={cn(
              "text-sm font-medium",
              isPrimaryVariant
                ? "text-primary-content/80"
                : "text-base-content/80"
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "p-2.5 rounded-xl",
              isPrimaryVariant
                ? "bg-primary-focus/30"
                : "bg-base-200/80 dark:bg-base-300/30",
              iconClassName
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isPrimaryVariant
                  ? "text-primary-content/90"
                  : "text-base-content/60"
              )}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div
            className={cn(
              "text-2xl font-bold tracking-tight",
              isPrimaryVariant
                ? "text-primary-content"
                : valueColorClasses[valueColor]
            )}
          >
            {value}
          </div>

          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <div
                className={cn(
                  "px-2 py-1 rounded-lg font-medium",
                  trend.isPositive
                    ? isPrimaryVariant
                      ? "bg-primary-focus/50 text-primary-content/90"
                      : "bg-success/10 text-success"
                    : isPrimaryVariant
                      ? "bg-primary-focus/50 text-primary-content/90"
                      : "bg-error/10 text-error"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </div>
              {trend.label && (
                <span
                  className={cn(
                    isPrimaryVariant
                      ? "text-primary-content/70"
                      : "text-base-content/60"
                  )}
                >
                  {trend.label}
                </span>
              )}
            </div>
          )}

          {description && (
            <p
              className={cn(
                "text-xs mt-1",
                isPrimaryVariant
                  ? "text-primary-content/70"
                  : "text-base-content/60"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
