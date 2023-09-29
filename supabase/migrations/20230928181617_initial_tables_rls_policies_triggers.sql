-- ENUM types
CREATE TYPE game_status AS ENUM('active', 'finished', 'abandoned', 'pending');
CREATE TYPE player_status AS ENUM('active', 'out');
CREATE TYPE move_type AS ENUM('add_letter', 'call_bluff', 'call_finished_word');
CREATE TYPE friendship_status AS ENUM('ignored', 'accepted', 'pending');
CREATE TYPE game_invitation_status AS ENUM('pending', 'accepted', 'declined');
CREATE TYPE notification_type AS ENUM (
    'game_invite',
    'friend_request',
    'game_move_turn'
);


-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
  username text unique,
  avatar_url text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, avatar_url)
  values (new.id, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Games Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status game_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    starter_id UUID REFERENCES profiles(id),
    winner_id UUID REFERENCES profiles(id)
);

-- Game Players Table
CREATE TABLE game_players (
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    result_position INTEGER,
    marks INTEGER DEFAULT 0,
    status player_status DEFAULT 'active',
    invitation_status game_invitation_status DEFAULT 'pending',
    PRIMARY KEY (game_id, user_id)
);

-- Game Rounds Table
CREATE TABLE game_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    status game_status NOT NULL DEFAULT 'active',
    last_moved_user_id UUID REFERENCES profiles(id),
    current_player_id UUID REFERENCES profiles(id),
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text)
);

-- 
CREATE TABLE round_player_order (
    round_id UUID REFERENCES game_rounds(id),
    player_id UUID REFERENCES profiles(id),
    order_of_play INT,
    PRIMARY KEY (round_id, player_id)
);

-- Round Moves Table
CREATE TABLE round_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    type move_type NOT NULL,
    letter CHAR(1),
    created_at timestamp with time zone null default (now() at time zone 'utc'::text)
);

-- Friendships Table
CREATE TABLE friendships (
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status friendship_status NOT NULL DEFAULT 'pending',
    PRIMARY KEY (requester_id, receiver_id)
);

-- User Stats Table
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES profiles(id),
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    avg_place DECIMAL(3, 2),
    most_started_letter CHAR(1)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                    -- Unique ID for the notification
    user_id UUID REFERENCES profiles(id),                                             -- The user this notification is for
    type notification_type NOT NULL,                                                  -- The type of notification (e.g., game invite, friend request, etc.)
    reference_id UUID,                                                                -- Generic ID that can refer to any other table, depending on the notification type (e.g., game ID, friend request ID)
    message TEXT,                                                                     -- A brief description or message for the notification
    seen BOOLEAN DEFAULT FALSE,                                                       -- Whether the notification has been seen/read by the user
    created_at timestamp with time zone null default (now() at time zone 'utc'::text) -- The time the notification was created
);

-- Row Level Security for other tables

-- games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON games
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- game_players
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON game_players
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- game_rounds
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON game_rounds
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- round_moves
ALTER TABLE round_moves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON round_moves
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON friendships
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON user_stats
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON notifications
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
