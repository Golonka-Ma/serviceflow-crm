import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DataListProps {
  children: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
}

interface DataListItemProps {
  icon?: LucideIcon;
  iconColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
  title: string;
  titleHref?: string;
  subtitle?: string;
  rightText?: string;
  rightLabel?: string;
  className?: string;
  onClick?: () => void;
}

export function DataList({
  children,
  className,
  emptyMessage = "Brak danych do wyświetlenia.",
  isLoading = false,
  loadingRows = 3,
}: DataListProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "divide-y divide-base-200 dark:divide-base-content/10",
          className
        )}
      >
        {[...Array(loadingRows)].map((_, i) => (
          <div key={i} className="py-3 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-base-300/50 dark:bg-base-content/5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-base-300/50 dark:bg-base-content/5"></div>
                <div className="h-3 w-1/2 rounded bg-base-300/50 dark:bg-base-content/5"></div>
              </div>
              <div className="h-3 w-16 rounded bg-base-300/50 dark:bg-base-content/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Check if children is empty (React.Children.count returns 0 for empty arrays/null/undefined)
  const isEmpty = React.Children.count(children) === 0;

  if (isEmpty) {
    return (
      <div className="py-4 text-center text-sm text-base-content/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "divide-y divide-base-200 dark:divide-base-content/10",
        className
      )}
    >
      {children}
    </ul>
  );
}

export function DataListItem({
  icon: Icon,
  iconColor = "default",
  title,
  titleHref,
  subtitle,
  rightText,
  rightLabel,
  className,
  onClick,
}: DataListItemProps) {
  // Icon color mappings
  const iconColorClasses = {
    default: "text-base-content/60",
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
  };

  const content = (
    <div className="flex items-center gap-4">
      {/* Icon (if provided) */}
      {Icon && (
        <div className="flex-shrink-0">
          <Icon className={cn("h-5 w-5", iconColorClasses[iconColor])} />
        </div>
      )}

      {/* Title and subtitle */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            titleHref && "hover:underline"
          )}
        >
          {title}
        </p>

        {subtitle && (
          <p className="truncate text-sm text-base-content/70 dark:text-base-content/60">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side content */}
      {(rightText || rightLabel) && (
        <div className="inline-flex flex-col items-end text-right">
          {rightText && (
            <span className="text-sm text-base-content/80">{rightText}</span>
          )}
          {rightLabel && (
            <span className="text-xs text-base-content/60">{rightLabel}</span>
          )}
        </div>
      )}
    </div>
  );

  const containerClasses = cn(
    "py-3 sm:py-4 transition-colors",
    onClick &&
      "cursor-pointer hover:bg-base-200/50 dark:hover:bg-base-content/5",
    className
  );

  // Wrap with link if titleHref is provided
  if (titleHref) {
    return (
      <li className={containerClasses}>
        <Link href={titleHref} className="block">
          {content}
        </Link>
      </li>
    );
  }

  // Otherwise, return as clickable div or static div
  return (
    <li className={containerClasses} onClick={onClick}>
      {content}
    </li>
  );
}
