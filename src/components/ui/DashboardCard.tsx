import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  viewAllLink?: string;
  viewAllLabel?: string;
  isLoading?: boolean;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  children,
  className,
  footer,
  viewAllLink,
  viewAllLabel = "Zobacz wszystkie",
  isLoading = false,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "card bg-base-100 border border-base-300 shadow-sm dark:border-base-content/10 dark:bg-base-200",
        "transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 dark:border-base-content/10">
          <h3 className="card-title text-lg font-medium">{title}</h3>

          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm gap-1 text-primary hover:text-primary-focus"
              >
                {viewAllLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>

        <div
          className={cn(
            "card-content",
            isLoading && "animate-pulse",
            !noPadding && "p-5"
          )}
        >
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="loading loading-spinner loading-md text-primary"></div>
            </div>
          ) : (
            children
          )}
        </div>

        {footer && (
          <div className="card-footer p-4 pt-0 border-t border-base-200 dark:border-base-content/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-4 md:gap-6", className)}>{children}</div>;
}
