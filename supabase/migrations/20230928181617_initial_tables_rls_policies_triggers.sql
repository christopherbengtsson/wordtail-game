-- Extensions
-- Enable the "http" extension
create extension http with schema extensions;

-- ENUM types
CREATE TYPE game_status AS ENUM('active', 'finished', 'abandoned', 'pending');
CREATE TYPE player_status AS ENUM('active', 'out');
CREATE TYPE move_type AS ENUM('add_letter', 'give_up', 'call_bluff', 'reveal_bluff', 'claim_finished_word');
CREATE TYPE friendship_status AS ENUM('ignored', 'accepted', 'pending');
CREATE TYPE game_invitation_status AS ENUM('pending', 'accepted', 'declined');
CREATE TYPE notification_type AS ENUM ('game_invite', 'friend_request', 'game_move_turn');

-- Create a table for public profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone DEFAULT current_timestamp,
  username text NOT NULL UNIQUE,
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR select USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR insert WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR update USING (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE 
    base_username TEXT;
    new_username TEXT;
BEGIN
    -- Cleanse the email by removing non-alphanumeric characters and truncating to a maximum length of 10
    base_username := LEFT(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]', '', 'g'), 10);
    new_username := base_username;

    -- Check if the base username exists
    WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
        -- Append up to 5 characters from the UUID, while ensuring we don't exceed 15 characters in total
        new_username := LEFT(base_username, 15 - LENGTH(substring(new.id FROM 1 FOR 5))) || substring(new.id FROM 1 FOR 5);
    END LOOP;

    INSERT INTO public.profiles (id, username)
    VALUES (new.id, new_username);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Games Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status game_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    creator_id UUID REFERENCES profiles(id),
    winner_id UUID REFERENCES profiles(id),
    max_number_of_marks INT NOT NULL DEFAULT 0
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
    word TEXT,
    created_at timestamp with time zone null default (now() at time zone 'utc'::text)
);

-- Friendships Table
CREATE TABLE friendships (
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status friendship_status NOT NULL DEFAULT 'pending',
    PRIMARY KEY (requester_id, receiver_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                    -- Unique ID for the notification
    user_id UUID REFERENCES profiles(id),                                             -- The user this notification is for
    type notification_type NOT NULL,                                                  -- The type of notification (e.g., game invite, friend request, etc.)
    reference_id UUID NOT NULL,                                                                -- Generic ID that can refer to any other table, depending on the notification type (e.g., game ID, friend request ID)
    message TEXT,                                                                     -- A brief description or message for the notification
    created_at timestamp with time zone null default (now() at time zone 'utc'::text), -- The time the notification was created
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text) -- The time the notification was updated
);

-- Replications
alter publication supabase_realtime add table notifications;

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

-- round_player_order
ALTER TABLE round_player_order ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON round_player_order
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

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable CRUD access for all authenticated users" ON notifications
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
