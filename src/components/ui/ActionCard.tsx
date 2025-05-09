import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ActionItem {
  icon: LucideIcon;
  label: string;
  href: string;
  description?: string;
  disabled?: boolean;
  color?: "default" | "primary" | "secondary" | "accent";
}

interface ActionCardProps {
  title: string;
  actions: ActionItem[];
  className?: string;
  buttonVariant?: "default" | "primary" | "secondary" | "outline" | "ghost";
}

export function ActionCard({
  title,
  actions,
  className,
  buttonVariant = "outline",
}: ActionCardProps) {
  // Color mappings
  const colorClasses = {
    default: "bg-base-200/70 text-base-content",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div
      className={cn(
        "card bg-base-100 border border-base-300 shadow-sm dark:border-base-content/10 dark:bg-base-200",
        "transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="card-body p-5">
        <h3 className="card-title text-lg font-medium mb-4">{title}</h3>

        <div className="space-y-3">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              item={action}
              variant={buttonVariant}
              colorClasses={colorClasses}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  item,
  variant,
  colorClasses,
}: {
  item: ActionItem;
  variant: string;
  colorClasses: Record<string, string>;
}) {
  const Icon = item.icon;
  const color = item.color || "default";

  return (
    <Link
      href={item.disabled ? "#" : item.href}
      className={item.disabled ? "pointer-events-none opacity-60" : ""}
    >
      <div className="group w-full">
        <Button
          variant={variant as any}
          className="w-full justify-start gap-3 h-auto py-3"
          disabled={item.disabled}
        >
          <div className={cn("p-2 rounded-full", colorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="text-left">
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <p className="text-xs text-base-content/60 mt-0.5">
                {item.description}
              </p>
            )}
          </div>
        </Button>
      </div>
    </Link>
  );
}
