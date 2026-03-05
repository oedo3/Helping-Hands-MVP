import { createClient } from "../client";

export async function getUserSignupIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("event_signups")
    .select("event_id")
    .eq("user_id", userId)
    .eq("status", "confirmed");

  if (error || !data) return [];
  return data.map((row) => row.event_id);
}

export async function signUpForEvent(
  userId: string,
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("event_signups")
    .insert({ user_id: userId, event_id: eventId, status: "confirmed" });

  if (error) {
    if (error.code === "23505") return { success: false, error: "Already signed up" };
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function cancelSignup(
  userId: string,
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("event_signups")
    .update({ status: "cancelled" })
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getSignedUpEvents(userId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("event_signups")
    .select("event_id, status, signed_up_at, events(*, organizations(name))")
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("signed_up_at", { ascending: false });

  if (error || !data) return { upcoming: [], past: [] };

  const upcoming: typeof data = [];
  const past: typeof data = [];

  for (const row of data) {
    const event = row.events as { event_date: string } | null;
    if (!event) continue;
    if (event.event_date >= today) {
      upcoming.push(row);
    } else {
      past.push(row);
    }
  }

  return { upcoming, past };
}
