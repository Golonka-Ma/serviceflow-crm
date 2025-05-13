"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Users,
  Briefcase,
  Bell,
  DollarSign,
  Calendar,
  UserPlus,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useSupabaseClient } from "@/context/SupabaseProvider";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@/components/auth/SessionProvider";

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

  const router = useRouter();

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
        />
      </StatsCardGrid>

      {/* Główna Sekcja Dashboard */}
      <DashboardOverview />

      {/* Sekcja Quick Actions i Aktywności */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Quick Actions */}
        <div className="lg:col-span-4">
          <ActionCard
            title="Szybkie akcje"
            actions={quickActions}
            buttonVariant="outline"
          />
        </div>

        {/* Upcoming Activities */}
        <div className="space-y-6 lg:col-span-8">
          {/* Upcoming Jobs */}
          <DashboardCard
            title="Nadchodzące zlecenia"
            viewAllLink="/jobs"
            viewAllLabel="Wszystkie zlecenia"
          >
            {upcomingJobs && upcomingJobs.length > 0 ? (
              <DataList>
                {upcomingJobs.map((job) => (
                  <DataListItem
                    key={job.id}
                    title={job.title}
                    titleHref={`/jobs/${job.id}`}
                    subtitle={`${job.clients.first_name} ${job.clients.last_name}`}
                    icon={Briefcase}
                    iconColor="secondary"
                    rightText={formatDate(job.scheduled_at)}
                  />
                ))}
              </DataList>
            ) : (
              <div className="py-8 text-center text-base-content/70">
                <p>Brak nadchodzących zleceń</p>
              </div>
            )}
          </DashboardCard>

          {/* Upcoming Reminders */}
          <DashboardCard
            title="Przypomnienia"
            viewAllLink="/reminders"
            viewAllLabel="Wszystkie przypomnienia"
          >
            {upcomingReminders && upcomingReminders.length > 0 ? (
              <DataList>
                {upcomingReminders.map((reminder) => (
                  <DataListItem
                    key={reminder.id}
                    title={reminder.title}
                    titleHref={`/reminders/${reminder.id}`}
                    subtitle={`${reminder.clients.first_name} ${reminder.clients.last_name}`}
                    icon={Bell}
                    iconColor="warning"
                    rightText={formatDate(reminder.reminder_date)}
                  />
                ))}
              </DataList>
            ) : (
              <div className="py-8 text-center text-base-content/70">
                <p>Brak nadchodzących przypomnień</p>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
