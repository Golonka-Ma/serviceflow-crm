// src/app/(app)/dashboard/page.tsx

import Link from "next/link";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Users,
  Briefcase,
  Bell,
  CreditCard,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StatCard, StatsCardGrid } from "@/components/ui/StatCard";

// --- Funkcje do pobierania danych (Server-Side) ---

async function getDashboardStats() {
  const supabase = createServerSupabaseClient(); // Client używający cookies z Server Component
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found in getDashboardStats");
      return {
        clientCount: 0,
        activeJobCount: 0,
        upcomingReminderCount: 0,
        recentRevenue: 0,
      };
    }

    // Get client count
    const { count: clientCount, error: clientError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (clientError) {
      console.error("Error fetching clients:", clientError);
      throw new Error("Failed to fetch clients");
    }

    // Get active jobs count
    const { count: activeJobCount, error: jobError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["scheduled", "in_progress"]);

    if (jobError) {
      console.error("Error fetching jobs:", jobError);
      throw new Error("Failed to fetch jobs");
    }

    // Get upcoming reminders
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const { count: upcomingReminderCount, error: reminderError } =
      await supabase
        .from("reminders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending")
        .gte("reminder_date", today.toISOString())
        .lte("reminder_date", nextWeek.toISOString());

    if (reminderError) {
      console.error("Error fetching reminders:", reminderError);
      throw new Error("Failed to fetch reminders");
    }

    // Get recent revenue
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30);
    const { data: recentJobs, error: revenueError } = await supabase
      .from("jobs")
      .select("price")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("completed_at", lastMonth.toISOString());

    if (revenueError) {
      console.error("Error fetching revenue:", revenueError);
      throw new Error("Failed to fetch revenue data");
    }

    const recentRevenue =
      recentJobs?.reduce((sum, job) => sum + (job.price || 0), 0) || 0;

    return {
      clientCount: clientCount ?? 0,
      activeJobCount: activeJobCount ?? 0,
      upcomingReminderCount: upcomingReminderCount ?? 0,
      recentRevenue: recentRevenue ?? 0,
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    // Return default values instead of throwing
    return {
      clientCount: 0,
      activeJobCount: 0,
      upcomingReminderCount: 0,
      recentRevenue: 0,
    };
  }
}

async function getUpcomingItems(limit = 5) {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found in getUpcomingItems");
      return { upcomingJobs: [], upcomingReminders: [] };
    }

    const today = new Date().toISOString();

    const { data: upcomingJobs, error: jobsError } = await supabase
      .from("jobs")
      .select(
        "id, title, scheduled_at, client_id, clients(first_name, last_name)"
      )
      .eq("user_id", user.id)
      .eq("status", "scheduled")
      .gte("scheduled_at", today)
      .order("scheduled_at", { ascending: true })
      .limit(limit);

    if (jobsError) {
      console.error("Error fetching upcoming jobs:", jobsError);
      throw new Error("Failed to fetch upcoming jobs");
    }

    const { data: upcomingReminders, error: remindersError } = await supabase
      .from("reminders")
      .select(
        "id, title, reminder_date, client_id, clients(first_name, last_name)"
      )
      .eq("user_id", user.id)
      .eq("status", "pending")
      .gte("reminder_date", today)
      .order("reminder_date", { ascending: true })
      .limit(limit);

    if (remindersError) {
      console.error("Error fetching upcoming reminders:", remindersError);
      throw new Error("Failed to fetch upcoming reminders");
    }

    return {
      upcomingJobs: upcomingJobs || [],
      upcomingReminders: upcomingReminders || [],
    };
  } catch (error) {
    console.error("Error in getUpcomingItems:", error);
    return { upcomingJobs: [], upcomingReminders: [] };
  }
}

// --- Komponent Strony Dashboardu (Server Component) ---

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  try {
    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      redirect("/login");
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    const welcomeName = profile?.first_name || user.email;

    // Get dashboard data
    const stats = await getDashboardStats();
    const { upcomingJobs, upcomingReminders } = await getUpcomingItems();

    // Przykładowe dane trendów (w rzeczywistej aplikacji te dane powinny pochodzić z API)
    const statTrends = {
      clientTrend: { value: 5, isPositive: true },
      jobTrend: { value: 3, isPositive: true },
      reminderTrend: { value: 2, isPositive: false },
      revenueTrend: { value: 8, isPositive: true },
    };

    // Przygotuj dane do przekazania do komponentu klienckiego
    const dashboardData = {
      welcomeName,
      stats,
      statTrends,
      upcomingJobs,
      upcomingReminders,
    };

    return (
      <div className="space-y-6">
        <DashboardContent data={dashboardData} />
      </div>
    );
  } catch (error) {
    console.error("Error in DashboardPage:", error);
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Wystąpił błąd"
          description="Przepraszamy, wystąpił błąd podczas ładowania strony."
        />
        <DashboardCard title="Informacje o błędzie">
          <div className="p-4 rounded-lg bg-error/10 text-error">
            <p>Sprawdź konsolę przeglądarki, aby zobaczyć szczegóły błędu.</p>
          </div>
        </DashboardCard>
      </div>
    );
  }
}
