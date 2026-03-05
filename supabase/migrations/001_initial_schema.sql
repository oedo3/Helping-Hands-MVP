-- ============================================================
-- HelpingHands MVP — Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (one per auth user, auto-created by trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  name                TEXT NOT NULL DEFAULT '',
  bio                 TEXT,
  avatar              TEXT NOT NULL DEFAULT '😊',
  interests           TEXT[] NOT NULL DEFAULT '{}',
  availability        TEXT[] NOT NULL DEFAULT '{}',
  skills              TEXT[] NOT NULL DEFAULT '{}',
  distance_pref       INTEGER NOT NULL DEFAULT 25,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  total_hours         NUMERIC(8,2) NOT NULL DEFAULT 0,
  impact_points       INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL DEFAULT 'Evansville',
  state       TEXT NOT NULL DEFAULT 'IN',
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL,
  address         TEXT NOT NULL,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  event_date      DATE NOT NULL,
  event_time      TIME NOT NULL,
  duration_hours  NUMERIC(4,2) NOT NULL DEFAULT 3,
  total_spots     INTEGER NOT NULL DEFAULT 20,
  spots_remaining INTEGER NOT NULL DEFAULT 20,
  image_url       TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event sign-ups
CREATE TABLE IF NOT EXISTS event_signups (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended_at  TIMESTAMPTZ,
  hours_logged NUMERIC(4,2),
  UNIQUE (user_id, event_id)
);

-- User notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT '🔔',
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id         UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  show_profile    BOOLEAN NOT NULL DEFAULT TRUE,
  show_hours      BOOLEAN NOT NULL DEFAULT TRUE,
  newsletter      BOOLEAN NOT NULL DEFAULT FALSE,
  notif_new_events BOOLEAN NOT NULL DEFAULT TRUE,
  notif_reminders  BOOLEAN NOT NULL DEFAULT TRUE,
  notif_updates    BOOLEAN NOT NULL DEFAULT TRUE,
  notif_messages   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_events_date        ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category    ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_org         ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_signups_user       ON event_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_signups_event      ON event_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id, read);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile + preferences when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Decrement spots_remaining when a signup is confirmed
CREATE OR REPLACE FUNCTION handle_signup_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

DROP TRIGGER IF EXISTS on_signup_change ON event_signups;
CREATE TRIGGER on_signup_change
  AFTER INSERT OR UPDATE OR DELETE ON event_signups
  FOR EACH ROW EXECUTE FUNCTION handle_signup_change();

-- Update impact_points + total_hours when signup is marked attended
CREATE OR REPLACE FUNCTION handle_attended_signup()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

DROP TRIGGER IF EXISTS on_signup_attended ON event_signups;
CREATE TRIGGER on_signup_attended
  AFTER UPDATE ON event_signups
  FOR EACH ROW EXECUTE FUNCTION handle_attended_signup();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE events             ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences   ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all public profiles, only edit their own
CREATE POLICY "profiles_select_all"  ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert_own"  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: everyone can read
CREATE POLICY "orgs_select_all" ON organizations FOR SELECT USING (TRUE);

-- Events: everyone can read active events
CREATE POLICY "events_select_active" ON events FOR SELECT USING (is_active = TRUE);

-- Event signups: users manage their own
CREATE POLICY "signups_select_own"  ON event_signups FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "signups_insert_own"  ON event_signups FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "signups_update_own"  ON event_signups FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "signups_delete_own"  ON event_signups FOR DELETE  USING (auth.uid() = user_id);

-- Notifications: users see only their own
CREATE POLICY "notifs_select_own" ON user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifs_update_own" ON user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifs_insert_own" ON user_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Preferences: users manage their own
CREATE POLICY "prefs_select_own" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "prefs_insert_own" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prefs_update_own" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA — Real Evansville, IN Organizations
-- ============================================================

INSERT INTO organizations (id, name, description, category, address, city, state, lat, lng, website, verified)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Tri-State Food Bank',
   'Serving Southwestern Indiana, Western Kentucky, and Southeastern Illinois — fighting hunger since 1982.',
   'Food & Hunger',
   '4119 Bellemeade Ave', 'Evansville', 'IN',
   37.9716, -87.5711,
   'https://www.tristatefoodbank.org', TRUE),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   'Evansville Christian Life Center',
   'Empowering families and individuals through faith-based community outreach and social services.',
   'Food & Hunger',
   '701 N Boeke Rd', 'Evansville', 'IN',
   37.9887, -87.5342,
   'https://eclc.org', TRUE),

  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Keep Evansville Beautiful',
   'Keeping Evansville clean, green, and beautiful through community litter cleanups and beautification.',
   'Environment',
   '100 NW Second St', 'Evansville', 'IN',
   37.9748, -87.5716,
   'https://www.keepevansvillebeautiful.org', TRUE),

  ('a1b2c3d4-0004-0004-0004-000000000004',
   'Habitat for Humanity of Evansville',
   'Building homes, communities, and hope. We partner with families to build safe, affordable housing.',
   'Housing',
   '929 SE 5th St', 'Evansville', 'IN',
   37.9672, -87.5609,
   'https://habitatevansville.org', TRUE),

  ('a1b2c3d4-0005-0005-0005-000000000005',
   'Evansville Animal Care & Control',
   'Protecting and promoting the welfare of animals in our community through education and adoption.',
   'Animals',
   '3917 Central Ave', 'Evansville', 'IN',
   37.9699, -87.5421,
   'https://www.evansvillegov.org/city/department/division/animal-care-control', TRUE),

  ('a1b2c3d4-0006-0006-0006-000000000006',
   'Youth First Inc.',
   'Strengthening youth and families through evidence-based school social work and mental health programs.',
   'Education',
   '1 NW MLK Jr Blvd', 'Evansville', 'IN',
   37.9748, -87.5590,
   'https://www.youthfirstinc.org', TRUE),

  ('a1b2c3d4-0007-0007-0007-000000000007',
   'Evansville ARC',
   'Providing services, education, and advocacy for people with intellectual and developmental disabilities.',
   'Education',
   '4601 Theater Dr', 'Evansville', 'IN',
   37.9914, -87.5512,
   'https://www.arcofkentuckiana.org', TRUE),

  ('a1b2c3d4-0008-0008-0008-000000000008',
   'Meals on Wheels of Evansville',
   'Delivering nutritious meals and friendly visits to homebound seniors throughout Vanderburgh County.',
   'Elderly Care',
   '205 E Herndon Dr', 'Evansville', 'IN',
   37.9852, -87.5492,
   'https://www.mealsonwheelsevansville.org', TRUE)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Events (2026 dates)
-- ============================================================

INSERT INTO events (organization_id, title, description, category, address, lat, lng, event_date, event_time, duration_hours, total_spots, spots_remaining, image_url, tags)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Weekend Food Sort & Pack',
   'Help sort and repack thousands of pounds of donated food at the Tri-State Food Bank warehouse. No experience needed — just bring energy and a willingness to make a difference!',
   'Food & Hunger',
   '4119 Bellemeade Ave, Evansville, IN',
   37.9716, -87.5711,
   '2026-03-14', '09:00', 4, 30, 24,
   'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&auto=format&fit=crop',
   ARRAY['food', 'sorting', 'warehouse', 'family-friendly']),

  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Mobile Food Pantry Distribution',
   'Volunteer at a mobile food distribution site and help families receive groceries directly in their neighborhood. You''ll be loading boxes, directing traffic, and serving with a smile.',
   'Food & Hunger',
   '1600 N Fares Ave, Evansville, IN',
   37.9934, -87.5598,
   '2026-03-21', '10:00', 3, 20, 15,
   'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop',
   ARRAY['food', 'distribution', 'outdoor', 'community']),

  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Riverside Park Spring Cleanup',
   'Join Keep Evansville Beautiful for our annual spring cleanup along the Ohio River! We provide gloves, bags, and all equipment. Help restore our beautiful riverfront for the whole community.',
   'Environment',
   'Dress Plaza, Evansville Riverfront',
   37.9700, -87.5780,
   '2026-03-28', '08:00', 3, 50, 38,
   'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop',
   ARRAY['cleanup', 'outdoors', 'environment', 'river']),

  ('a1b2c3d4-0004-0004-0004-000000000004',
   'Habitat Build Day — Haynie''s Corner',
   'Put on your work gloves and help build an affordable home for a local family! Habitat for Humanity will train you on-site. All skill levels welcome — no experience needed.',
   'Housing',
   'Haynie''s Corner Arts District, Evansville, IN',
   37.9689, -87.5563,
   '2026-04-04', '07:30', 6, 20, 12,
   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop',
   ARRAY['construction', 'housing', 'habitat', 'skilled']),

  ('a1b2c3d4-0005-0005-0005-000000000005',
   'Shelter Dog Walking & Socialization',
   'Give shelter dogs the love and exercise they need! Walk dogs, play with cats, and help socialize animals awaiting adoption. Great for animal lovers of all ages.',
   'Animals',
   '3917 Central Ave, Evansville, IN',
   37.9699, -87.5421,
   '2026-04-11', '11:00', 2, 15, 9,
   'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&auto=format&fit=crop',
   ARRAY['animals', 'dogs', 'shelter', 'family-friendly']),

  ('a1b2c3d4-0006-0006-0006-000000000006',
   'After-School Tutoring & Mentorship',
   'Spend time with elementary and middle school students who need academic support. Tutors help with reading, math, and homework. A background check is required.',
   'Education',
   'Glenwood Leadership Academy, Evansville, IN',
   37.9811, -87.5433,
   '2026-03-17', '15:30', 2, 12, 7,
   'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop',
   ARRAY['education', 'tutoring', 'youth', 'mentorship']),

  ('a1b2c3d4-0008-0008-0008-000000000008',
   'Meal Delivery for Homebound Seniors',
   'Drive a Meals on Wheels route and deliver hot, nutritious meals to elderly and disabled residents who cannot leave their homes. Your visit may be their only social contact of the day.',
   'Elderly Care',
   '205 E Herndon Dr, Evansville, IN',
   37.9852, -87.5492,
   '2026-03-19', '10:30', 2, 8, 5,
   'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop',
   ARRAY['elderly', 'meals', 'driving', 'social']),

  ('a1b2c3d4-0004-0004-0004-000000000004',
   'ReStore Donation Processing',
   'Help sort, clean, and price donated building materials, appliances, and home goods at the Habitat ReStore. Proceeds fund local home builds.',
   'Housing',
   '929 SE 5th St, Evansville, IN',
   37.9672, -87.5609,
   '2026-04-18', '09:00', 4, 15, 11,
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
   ARRAY['habitat', 'restore', 'retail', 'indoor']),

  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Garvin Park Tree Planting',
   'Help reforest Evansville! Plant native trees and shrubs in Garvin Park as part of our urban canopy expansion initiative. Tools and instruction provided.',
   'Environment',
   'Garvin Park, 1000 N Garvin St, Evansville, IN',
   37.9870, -87.5560,
   '2026-04-25', '09:00', 3, 25, 18,
   'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop',
   ARRAY['trees', 'environment', 'outdoor', 'earth-day']),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   'Community Kitchen Prep & Service',
   'Help prepare and serve meals at ECLC''s community kitchen. Whether chopping vegetables, ladling soup, or cleaning up — every role matters to those who depend on us.',
   'Food & Hunger',
   '701 N Boeke Rd, Evansville, IN',
   37.9887, -87.5342,
   '2026-03-24', '11:00', 3, 10, 6,
   'https://images.unsplash.com/photo-1574615552137-462d9c3fc45b?w=800&auto=format&fit=crop',
   ARRAY['cooking', 'food', 'kitchen', 'indoor'])

ON CONFLICT DO NOTHING;
