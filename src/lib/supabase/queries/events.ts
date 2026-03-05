import { createClient } from "../client";
import type { DbEvent } from "../../types";

interface EventWithOrg {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  event_date: string;
  event_time: string;
  duration_hours: number;
  total_spots: number;
  spots_remaining: number;
  image_url: string | null;
  tags: string[];
  organizations: { name: string } | null;
}

function rowToDbEvent(row: EventWithOrg): DbEvent {
  return {
    id: row.id,
    organizationId: row.organization_id,
    organizationName: row.organizations?.name ?? "Unknown Organization",
    title: row.title,
    description: row.description,
    category: row.category,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    eventDate: row.event_date,
    eventTime: row.event_time,
    durationHours: Number(row.duration_hours),
    totalSpots: row.total_spots,
    spotsRemaining: row.spots_remaining,
    imageUrl: row.image_url,
    tags: row.tags,
  };
}

export async function getUpcomingEvents(limit = 20): Promise<DbEvent[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("is_active", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return (data as EventWithOrg[]).map(rowToDbEvent);
}

export async function getEventsByCategory(category: string): Promise<DbEvent[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("is_active", true)
    .eq("category", category)
    .gte("event_date", today)
    .order("event_date", { ascending: true });

  if (error || !data) return [];
  return (data as EventWithOrg[]).map(rowToDbEvent);
}

export async function getEventById(eventId: string): Promise<DbEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("id", eventId)
    .single();

  if (error || !data) return null;
  return rowToDbEvent(data as EventWithOrg);
}
