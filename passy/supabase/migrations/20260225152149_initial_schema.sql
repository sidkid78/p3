-- ==============================================================
-- PASSY AI BABY SHOWER PLANNER — INITIAL SCHEMA
-- ==============================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================
-- CUSTOM ENUM TYPES
-- ==============================================================
CREATE TYPE rsvp_status AS ENUM ('Pending', 'Confirmed', 'Declined');
CREATE TYPE budget_status AS ENUM ('Draft', 'Deposit', 'Settled', 'Not Booked');
CREATE TYPE task_status AS ENUM ('Todo', 'InProgress', 'Completed');
CREATE TYPE user_role AS ENUM ('Owner', 'Planner', 'Viewer');
CREATE TYPE timeline_category AS ENUM ('3 Months Before', '1 Month Before', 'Week of', 'Post-Event');

-- ==============================================================
-- TABLES
-- ==============================================================

-- 1. PROFILES (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  is_plus_member BOOLEAN DEFAULT FALSE,
  ai_credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENTS (core planning entity)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE,
  theme_name TEXT DEFAULT 'Celestial Dreams',
  theme_description TEXT,
  color_palette TEXT[],
  mood_board_url JSONB,
  budget_limit DECIMAL(12,2) DEFAULT 5000.00,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TEAM MEMBERS (RBAC / collaboration)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role DEFAULT 'Planner',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 4. GUESTS & RSVP
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  rsvp_status rsvp_status DEFAULT 'Pending',
  dietary_requirements TEXT,
  gift_received TEXT,
  thank_you_sent BOOLEAN DEFAULT FALSE,
  plus_one_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BUDGET ITEMS
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  estimated_amount DECIMAL(12,2) DEFAULT 0.00,
  actual_amount DECIMAL(12,2) DEFAULT 0.00,
  status budget_status DEFAULT 'Draft',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TASKS / CHECKLIST
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category timeline_category DEFAULT '3 Months Before',
  status task_status DEFAULT 'Todo',
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  is_ai_suggested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SAVED VENDORS (Marketplace)
CREATE TABLE saved_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  vendor_name TEXT NOT NULL,
  category TEXT,
  contact_info JSONB,
  website_url TEXT,
  matches_theme BOOLEAN DEFAULT TRUE,
  external_vendor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================
-- ROW LEVEL SECURITY
-- ==============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_vendors ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user has access to a given event
CREATE OR REPLACE FUNCTION has_event_access(p_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM events WHERE id = p_event_id AND owner_id = auth.uid()
    UNION
    SELECT 1 FROM team_members WHERE event_id = p_event_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES policies
CREATE POLICY "Users can view any profile"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- EVENTS policies
CREATE POLICY "Users can view their own or team events"
  ON events FOR SELECT USING (owner_id = auth.uid() OR has_event_access(id));
CREATE POLICY "Owners can insert events"
  ON events FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update their events"
  ON events FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete their events"
  ON events FOR DELETE USING (owner_id = auth.uid());

-- TEAM MEMBERS policies
CREATE POLICY "Team members can view team"
  ON team_members FOR SELECT USING (has_event_access(event_id));
CREATE POLICY "Owners can manage team"
  ON team_members FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE id = event_id AND owner_id = auth.uid())
  );

-- GUESTS policies
CREATE POLICY "Team members can manage guests"
  ON guests FOR ALL USING (has_event_access(event_id));

-- BUDGET ITEMS policies
CREATE POLICY "Team members can manage budget"
  ON budget_items FOR ALL USING (has_event_access(event_id));

-- TASKS policies
CREATE POLICY "Team members can manage tasks"
  ON tasks FOR ALL USING (has_event_access(event_id));

-- SAVED VENDORS policies
CREATE POLICY "Team members can manage vendors"
  ON saved_vendors FOR ALL USING (has_event_access(event_id));

-- ==============================================================
-- TRIGGER: Auto-create profile on user signup
-- ==============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
