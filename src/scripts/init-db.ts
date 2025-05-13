import { createBrowserSupabaseClient } from "@/lib/supabase/client";

async function initDatabase() {
  try {
    const supabase = createBrowserSupabaseClient();

    // Sprawdź połączenie
    const { data, error } = await supabase.from("clients").select("count");

    if (error) {
      console.error("Błąd połączenia z bazą danych:", error);
      return;
    }

    console.log("Połączenie z bazą danych udane!");

    // Sprawdź czy tabele istnieją
    const tables = ["clients", "companies", "jobs", "reminders"];

    for (const table of tables) {
      const { data: tableExists } = await supabase
        .from(table)
        .select("count")
        .limit(1);

      if (tableExists) {
        console.log(`Tabela ${table} istnieje`);
      } else {
        console.log(`Tabela ${table} nie istnieje`);
      }
    }
  } catch (error) {
    console.error("Błąd podczas inicjalizacji bazy danych:", error);
  }
}

initDatabase();
