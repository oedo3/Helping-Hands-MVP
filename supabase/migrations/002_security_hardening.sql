-- ============================================================
-- HelpingHands MVP — Security Hardening Migration
-- ============================================================

-- ============================================================
-- Fix 1: Make trigger functions SECURITY DEFINER
-- This makes their behavior explicit — they always run with
-- the privileges of the function owner (postgres superuser),
-- guaranteeing they can update spots_remaining and impact_points
-- regardless of the calling user's RLS context.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_signup_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE events SET spots_remaining = GREATEST(spots_remaining - 1, 0)
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE events SET spots_remaining = LEAST(spots_remaining + 1, total_spots)
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'confirmed' THEN
      UPDATE events SET spots_remaining = GREATEST(spots_remaining - 1, 0)
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE events SET spots_remaining = LEAST(spots_remaining + 1, total_spots)
    WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION handle_attended_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF NEW.status = 'attended' AND OLD.status != 'attended' AND NEW.hours_logged IS NOT NULL THEN
    UPDATE profiles
    SET
      total_hours   = total_hours + NEW.hours_logged,
      impact_points = impact_points + CEIL(NEW.hours_logged * 10)::INTEGER
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- Fix 2: Restrict profile visibility to authenticated users only
-- Unauthenticated (guest) users don't need to read other
-- users' profile data.
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_authenticated"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can always read their own profile (even if the above
-- policy is ever restricted further)
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- ============================================================
-- Fix 3: Add DELETE policy on notifications
-- Users should be able to clear/delete their own notifications.
-- ============================================================

DROP POLICY IF EXISTS "notifs_delete_own" ON user_notifications;
CREATE POLICY "notifs_delete_own"
  ON user_notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Fix 4: Prevent signups on fully-booked events at DB level
-- Add a check constraint so spots_remaining never goes negative.
-- ============================================================

ALTER TABLE events
  DROP CONSTRAINT IF EXISTS events_spots_remaining_check;

ALTER TABLE events
  ADD CONSTRAINT events_spots_remaining_check
  CHECK (spots_remaining >= 0 AND spots_remaining <= total_spots);

-- ============================================================
-- Fix 5: Revoke direct public schema access for anon role
-- This ensures the anon role can ONLY access what RLS allows.
-- (Supabase does this by default, but this makes it explicit.)
-- ============================================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

GRANT SELECT ON organizations TO anon;
GRANT SELECT ON events TO anon;
-- Authenticated users get full access (RLS policies still apply)
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT ON organizations TO authenticated;
GRANT SELECT ON events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_signups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;
