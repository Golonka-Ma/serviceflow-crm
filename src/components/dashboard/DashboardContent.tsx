"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Users,
  Briefcase,
  Bell,
  DollarSign,
  CheckCircle,
  Calendar,
  UserPlus,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

// Import nowe komponenty
import {
  DashboardCard,
  DashboardCardGrid,
} from "@/components/ui/DashboardCard";
import { StatCard, StatsCardGrid } from "@/components/ui/StatCard";
import { ActionCard } from "@/components/ui/ActionCard";
import { DataList, DataListItem } from "@/components/ui/DataList";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

interface DashboardContentProps {
  data: {
    welcomeName: string;
    stats: {
      clientCount: number;
      activeJobCount: number;
      upcomingReminderCount: number;
      recentRevenue: number;
    };
    statTrends: {
      clientTrend: { value: number; isPositive: boolean };
      jobTrend: { value: number; isPositive: boolean };
      reminderTrend: { value: number; isPositive: boolean };
      revenueTrend: { value: number; isPositive: boolean };
    };
    upcomingJobs: any[];
    upcomingReminders: any[];
  };
}

export function DashboardContent({ data }: DashboardContentProps) {
  const { welcomeName, stats, statTrends, upcomingJobs, upcomingReminders } =
    data;

  // Akcje szybkiego dostępu
  const quickActions = [
    {
      icon: UserPlus,
      label: "Dodaj Nowego Klienta",
      href: "/clients/new",
      description: "Stwórz nową kartę klienta",
      color: "primary" as const,
    },
    {
      icon: Briefcase,
      label: "Nowe Zlecenie",
      href: "/jobs/new",
      description: "Utwórz nowe zlecenie dla klienta",
      color: "secondary" as const,
    },
    {
      icon: Calendar,
      label: "Kalendarz",
      href: "/calendar",
      description: "Zaplanuj spotkania i zlecenia",
      color: "accent" as const,
    },
    {
      icon: Bell,
      label: "Ustaw Przypomnienie",
      href: "/reminders/new",
      description: "Nie przegap ważnych terminów",
      color: "default" as const,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={`Witaj z powrotem, ${welcomeName}!`}
        description="Oto szybki przegląd Twojej działalności."
      />

      {/* Sekcja Statystyk */}
      <StatsCardGrid>
        <StatCard
          title="Ilość klientów"
          value={stats.clientCount}
          icon={Users}
          description="Liczba aktywnych klientów"
          trend={statTrends.clientTrend}
          iconClassName="bg-primary/10"
        />
        <StatCard
          title="Podsumowanie zleceń"
          value={stats.activeJobCount}
          icon={Briefcase}
          description="Zaplanowane lub w trakcie"
          trend={statTrends.jobTrend}
          iconClassName="bg-secondary/10"
        />
        <StatCard
          title="Przypomnienia"
          value={stats.upcomingReminderCount}
          icon={Bell}
          description="W ciągu najbliższych 7 dni"
          trend={statTrends.reminderTrend}
          iconClassName="bg-warning/10"
        />
        <StatCard
          title="Przychód"
          value={formatCurrency(stats.recentRevenue)}
          icon={DollarSign}
          description="Przychód z 30 dni"
          trend={{ value: 27, isPositive: true }}
          variant="primary"
        />
      </StatsCardGrid>

      {/* Główna Sekcja Dashboard */}
      <DashboardOverview />

      <DashboardCardGrid className="grid-cols-1 lg:grid-cols-3">
        {/* Szybkie Akcje */}
        <ActionCard
          title="Szybkie Akcje"
          actions={quickActions}
          buttonVariant="outline"
        />

        {/* Nadchodzące Zlecenia */}
        <DashboardCard
          title="Nadchodzące Zlecenia"
          viewAllLink="/jobs?status=scheduled"
          className="lg:col-span-2"
        >
          <DataList emptyMessage="Brak nadchodzących zleceń.">
            {upcomingJobs.map((job: any) => (
              <DataListItem
                key={job.id}
                icon={CheckCircle}
                iconColor="secondary"
                title={job.title}
                titleHref={`/jobs/${job.id}`}
                subtitle={
                  job.clients
                    ? `${job.clients.first_name} ${job.clients.last_name}`
                    : "Brak klienta"
                }
                rightText={
                  job.scheduled_at
                    ? formatDate(job.scheduled_at, "dd.MM HH:mm")
                    : "-"
                }
              />
            ))}
          </DataList>
        </DashboardCard>

        {/* Nadchodzące Przypomnienia */}
        <DashboardCard
          title="Nadchodzące Przypomnienia"
          viewAllLink="/reminders?status=pending"
          className="lg:col-span-3"
        >
          <DataList emptyMessage="Brak nadchodzących przypomnień.">
            {upcomingReminders.map((reminder: any) => (
              <DataListItem
                key={reminder.id}
                icon={Bell}
                iconColor="warning"
                title={reminder.title}
                titleHref={`/reminders/${reminder.id}`}
                subtitle={
                  reminder.clients
                    ? `${reminder.clients.first_name} ${reminder.clients.last_name}`
                    : reminder.job_id
                      ? "Zlecenie"
                      : "Ogólne"
                }
                rightText={
                  reminder.reminder_date
                    ? formatDate(reminder.reminder_date, "dd.MM HH:mm")
                    : "-"
                }
              />
            ))}
          </DataList>
        </DashboardCard>
      </DashboardCardGrid>
    </div>
  );
}
