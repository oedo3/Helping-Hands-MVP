import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    const url = new URL("/auth", origin);
    url.searchParams.set("error", "Could not confirm email — link may have expired.");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    const url = new URL("/auth", origin);
    url.searchParams.set("error", "Could not confirm email — please try signing up again.");
    return NextResponse.redirect(url);
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", data.session.user.id)
    .single();

  const destination = profile?.onboarding_complete ? "/explore" : "/onboarding";
  return NextResponse.redirect(new URL(destination, origin));
}
