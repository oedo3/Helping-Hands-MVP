import { createClient } from "../client";
import type { UserPreferences } from "../../types";
import type { Database } from "../database.types";

type PrefsRow = Database["public"]["Tables"]["user_preferences"]["Row"];

function rowToPrefs(row: PrefsRow): UserPreferences {
  return {
    showProfile: row.show_profile,
    showHours: row.show_hours,
    newsletter: row.newsletter,
    notifNewEvents: row.notif_new_events,
    notifReminders: row.notif_reminders,
    notifUpdates: row.notif_updates,
    notifMessages: row.notif_messages,
  };
}

export async function getPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return rowToPrefs(data);
}

export async function updatePreferences(
  userId: string,
  updates: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  const supabase = createClient();

  const dbUpdates: Partial<Database["public"]["Tables"]["user_preferences"]["Update"]> = {
    updated_at: new Date().toISOString(),
  };
  if (updates.showProfile !== undefined) dbUpdates.show_profile = updates.showProfile;
  if (updates.showHours !== undefined) dbUpdates.show_hours = updates.showHours;
  if (updates.newsletter !== undefined) dbUpdates.newsletter = updates.newsletter;
  if (updates.notifNewEvents !== undefined) dbUpdates.notif_new_events = updates.notifNewEvents;
  if (updates.notifReminders !== undefined) dbUpdates.notif_reminders = updates.notifReminders;
  if (updates.notifUpdates !== undefined) dbUpdates.notif_updates = updates.notifUpdates;
  if (updates.notifMessages !== undefined) dbUpdates.notif_messages = updates.notifMessages;

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, ...dbUpdates })
    .select()
    .single();

  if (error || !data) return null;
  return rowToPrefs(data);
}
