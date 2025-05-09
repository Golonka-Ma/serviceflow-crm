"use client";

import React from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { MetricBadge, MetricBadgeGroup } from "@/components/ui/MetricBadge";
import {
  BarChart3,
  LineChart,
  TrendingUp,
  Users,
  Calendar,
  Briefcase,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DashboardOverviewProps {
  performanceData?: {
    completionRate?: number;
    avgResponseTime?: number;
    clientGrowth?: number;
    repeatClients?: number;
  };
  isLoading?: boolean;
}

export function DashboardOverview({
  performanceData = {},
  isLoading = false,
}: DashboardOverviewProps) {
  const {
    completionRate = 94,
    avgResponseTime = 4.5,
    clientGrowth = 12,
    repeatClients = 76,
  } = performanceData;

  // Przykładowe dane statystyk tygodniowych i miesięcznych
  // (w rzeczywistej aplikacji powinny pochodzić z API)
  const weeklyStats = {
    completed: 18,
    lastWeek: 15,
    trend: ((18 - 15) / 15) * 100,
    clients: 8,
    revenue: "4,250 PLN",
  };

  const monthlyStats = {
    completed: 73,
    lastMonth: 65,
    trend: ((73 - 65) / 65) * 100,
    clients: 32,
    revenue: "16,780 PLN",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 rounded-lg">
      {/* Wydajność */}
      <DashboardCard title="Wydajność" isLoading={isLoading}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase text-base-content/60">
              Wykonalność Zleceń
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <MetricBadge value="+3%" trend="up" variant="success" size="sm" />
            </div>
            <div className="text-xs text-base-content/60">
              Procent zleceń zakończonych na czas
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase text-base-content/60">
              Średni Czas Reakcji
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{avgResponseTime}h</div>
              <MetricBadge
                value="-0.5h"
                trend="down"
                variant="success"
                size="sm"
              />
            </div>
            <div className="text-xs text-base-content/60">
              Od kontaktu klienta do odpowiedzi
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase text-base-content/60">
              Wzrost Bazy Klientów
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{clientGrowth}%</div>
              <MetricBadge value="+2%" trend="up" variant="success" size="sm" />
            </div>
            <div className="text-xs text-base-content/60">
              Wzrost rok do roku
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase text-base-content/60">
              Powracający Klienci
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{repeatClients}%</div>
              <MetricBadge value="+4%" trend="up" variant="success" size="sm" />
            </div>
            <div className="text-xs text-base-content/60">
              Klienci z wieloma zleceniami
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Tygodniowe podsumowanie */}
      <DashboardCard title="Tygodniowe Podsumowanie" isLoading={isLoading}>
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-base-200 dark:border-base-content/10">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span className="font-medium">Ukończone Zlecenia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{weeklyStats.completed}</span>
              <MetricBadge
                value={`${weeklyStats.trend > 0 ? "+" : ""}${Math.round(weeklyStats.trend)}%`}
                trend={weeklyStats.trend > 0 ? "up" : "down"}
                variant={weeklyStats.trend > 0 ? "success" : "error"}
                size="sm"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-base-content/60">Nowi Klienci</span>
              <span className="font-medium">{weeklyStats.clients}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-base-content/60">Przychód</span>
              <span className="font-medium">{weeklyStats.revenue}</span>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-medium mb-2">
              Status Aktywnych Zleceń
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <MetricBadge
                value="12"
                label="Oczekujące"
                variant="info"
                size="sm"
              />
              <MetricBadge
                value="8"
                label="W trakcie"
                variant="warning"
                size="sm"
              />
              <MetricBadge
                value="3"
                label="Opóźnione"
                variant="error"
                size="sm"
              />
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
