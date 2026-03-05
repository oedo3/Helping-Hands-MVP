import { createClient } from "../client";
import type { AppNotification } from "../../types";

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    icon: row.icon,
    read: row.read,
    timestamp: new Date(row.created_at),
  }));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("user_notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  icon = "🔔"
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("user_notifications")
    .insert({ user_id: userId, title, body, icon });
}
