import { createClient } from "../client";
import type { UserProfile } from "../../types";
import type { Database } from "../database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    name: row.name,
    bio: row.bio ?? "",
    avatar: row.avatar,
    interests: row.interests,
    availability: row.availability,
    skills: row.skills,
    distancePref: row.distance_pref,
    onboardingComplete: row.onboarding_complete,
    totalHours: Number(row.total_hours),
    impactPoints: row.impact_points,
  };
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return rowToProfile(data);
}

export async function updateProfile(
  userId: string,
  updates: Partial<{
    name: string;
    bio: string;
    avatar: string;
    interests: string[];
    availability: string[];
    skills: string[];
    distance_pref: number;
    onboarding_complete: boolean;
  }>
): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;
  return rowToProfile(data);
}
