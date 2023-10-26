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

-- Store Procedures
-- ================================================
-- Function: get_user_games
-- Description: 
--    Retrieves games associated with a specific user along with detailed information about each game.
--
-- Parameters:
--    - p_user_id: UUID of the user whose games are to be retrieved.
--
-- Returns: 
--    A table with detailed information about each game associated with the user.
--
-- Notes: 
--    - This function assumes the existence of the required tables (games, game_players, game_rounds, profiles, round_moves).
--    - The function returns details like game ID, name, status, timestamps, creator details, current turn player details, winner details, and a list of users yet to accept a pending game.
-- ================================================
CREATE OR REPLACE FUNCTION get_user_games(p_user_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    status game_status,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "playerStatus" player_status,
    "creatorProfileId" UUID,
    "creatorUsername" TEXT,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "winnerProfileId" UUID,
    "winnerUsername" TEXT,
    "waitingForUsers" UUID[]
) AS $$
BEGIN
    -- Return a structured query
    RETURN QUERY

    -- Define a CTE for details of active games, including the current player and player status.
    WITH ActiveGames AS (
        SELECT 
            g.id,
            g.name,
            g.created_at,
            COALESCE(MAX(rm.created_at), g.updated_at) AS updated_at, -- Take the latest move time, or if none, game's update time.
            p.id AS current_turn_profile_id,
            p.username AS current_turn_username,
            gp.status
        FROM games g
        JOIN game_players gp ON g.id = gp.game_id
        LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
        LEFT JOIN profiles p ON p.id = gr.current_player_id
        LEFT JOIN round_moves rm ON rm.game_round_id = gr.id
        WHERE g.status = 'active' AND gp.user_id = p_user_id
        GROUP BY g.id, g.name, g.created_at, p.id, p.username, gp.status
    ),
    
    -- Define a CTE for creator details.
    CreatorDetails AS (
        SELECT g.id, ps.id AS creator_profile_id, ps.username AS creator_username
        FROM games g
        JOIN profiles ps ON ps.id = g.creator_id
    ),
    
    -- Define a CTE for details of the game's winner.
    WinnerDetails AS (
        SELECT g.id, pw.id AS winner_profile_id, pw.username AS winner_username
        FROM games g
        LEFT JOIN profiles pw ON pw.id = g.winner_id
    ),
    
    -- Define a CTE for list of users yet to accept a pending game.
    PendingInvitations AS (
        SELECT g.id, ARRAY(SELECT user_id FROM game_players WHERE game_id = g.id AND invitation_status = 'pending') AS waiting_for_users
        FROM games g
        WHERE g.status = 'pending'
    )

    -- Combine data from all the CTEs to produce the final result set.
    SELECT 
        g.id,
        g.name,
        g.status,
        g.created_at,
        COALESCE(ActiveGames.updated_at, g.updated_at),
        ActiveGames.status,
        CreatorDetails.creator_profile_id,
        CreatorDetails.creator_username,
        ActiveGames.current_turn_profile_id,
        ActiveGames.current_turn_username,
        WinnerDetails.winner_profile_id,
        WinnerDetails.winner_username,
        PendingInvitations.waiting_for_users

    FROM games g
    LEFT JOIN ActiveGames ON g.id = ActiveGames.id
    LEFT JOIN CreatorDetails ON g.id = CreatorDetails.id
    LEFT JOIN WinnerDetails ON g.id = WinnerDetails.id
    LEFT JOIN PendingInvitations ON g.id = PendingInvitations.id
    WHERE EXISTS (SELECT 1 FROM game_players WHERE game_id = g.id AND user_id = p_user_id); -- Ensure user is part of the game.
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: create_new_game
-- Description: 
--    Creates a new game entry in the games table and associates players with the game.
--    The game's creator is automatically set to 'accepted' status, while others are set to 'pending'.
--
-- Parameters:
--    - p_game_name: Name of the new game.
--    - p_player_ids: Array of player UUIDs who are to be part of this game.
--    - p_creator_id: UUID of the user who creates the game.
--    - p_max_number_of_marks: Maximum number of marks allowed for the game.
--
-- Returns: 
--    UUID of the newly created game.
--
-- Notes: 
--    - This function assumes the existence of the required tables (games, game_players).
--    - Players will initially be set with a 'pending' invitation status unless they are the creator.
--    - The creator of the game will always be included in the list of players, even if not explicitly provided in p_player_ids.
-- ================================================
CREATE OR REPLACE FUNCTION create_new_game(p_game_name TEXT, p_player_ids UUID[], p_creator_id UUID, p_max_number_of_marks INT)
RETURNS UUID AS $$
DECLARE
    new_game_id UUID;           -- Holds the ID of the newly created game.
    all_player_ids UUID[];      -- List of all player IDs including the creator.
BEGIN
    -- Check if the creator_id is already included in the player_ids.
    -- If not, append it to the list. Otherwise, use the provided list as is.
    IF p_creator_id = ANY(p_player_ids) THEN
        all_player_ids := p_player_ids;
    ELSE
        all_player_ids := p_player_ids || ARRAY[p_creator_id];
    END IF;

    -- Insert a new game record with the provided details.
    -- Fetch the ID of this new game for later use.
    INSERT INTO games (name, creator_id, status, max_number_of_marks)
    VALUES (p_game_name, p_creator_id, 'pending', p_max_number_of_marks)
    RETURNING id INTO new_game_id;

    -- Insert all players (including the creator) with status 'pending'
    INSERT INTO game_players (game_id, user_id, invitation_status)
    SELECT new_game_id, unnested_player, 'pending'::game_invitation_status
    FROM UNNEST(all_player_ids) AS unnested_player;

    -- Update the creator's status to 'accepted'
    UPDATE game_players
    SET invitation_status = 'accepted'::game_invitation_status
    WHERE game_id = new_game_id AND user_id = p_creator_id;

    -- Add notification for each player, referencing the new game ID
    FOR i IN 1..array_length(p_player_ids, 1)
    LOOP
        PERFORM internal_add_notification(p_player_ids[i], 'game_invite', new_game_id);
    END LOOP;

    -- Return the ID of the newly created game.
    RETURN new_game_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: accept_game_invitation
-- Description: 
--    Allows a user to accept an invitation to a game.
--    If all players have accepted, the game is set to 'active' and the rounds are initiated.
--
-- Parameters:
--    - p_game_id: The ID of the game to accept the invitation for.
--    - p_user_id: The ID of the user accepting the invitation.
--
-- Returns: 
--    A game_status indicating the current status of the game after the invitation is accepted.
--
-- Notes: 
--    - This function assumes the existence of the required tables and relationships among them.
--    - Game starts once all players have accepted the invitation.
-- ================================================
CREATE OR REPLACE FUNCTION accept_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    game_creator_id UUID;
    starting_player UUID;
    second_player UUID;
BEGIN
    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, p_game_id);
    -- Update the invitation status for the user
    UPDATE game_players 
    SET invitation_status = 'accepted' 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total players and the number of accepted invitations
    SELECT COUNT(*), COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Fetch the game creator's ID
    SELECT creator_id INTO game_creator_id FROM games WHERE id = p_game_id;

    -- Decide the starting player
    IF accepted_count = total_players THEN
        game_state := 'active';
        starting_player := p_user_id;
        second_player := game_creator_id;
    ELSE
        game_state := 'pending';
        RETURN game_state; -- Early return if the game is still pending
    END IF;

    -- Insert the first round into the game_rounds table
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, 1, 'active', starting_player)
    RETURNING id INTO round_id;

    -- Insert the players into round_player_order based on their play order
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    VALUES 
        (round_id, starting_player, 1),
        (round_id, second_player, 2);

    -- Random order for the rest of the players (excluding starting and second players)
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    SELECT round_id, user_id, row_number() OVER () + 2
    FROM game_players 
    WHERE game_id = p_game_id AND user_id NOT IN (starting_player, second_player)
    ORDER BY RANDOM();

    -- Update the game's status in the games table
    UPDATE games 
    SET status = game_state, updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_game_id;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: decline_game_invitation
-- Description: 
--    Allows a user to decline an invitation to a game.
--    If the number of players is reduced to 1, the game is marked 'abandoned'.
--    If there are more players left and all have accepted, the game status is set to 'active' with a different round setup.
--
-- Parameters:
--    - p_game_id: The ID of the game to decline the invitation for.
--    - p_user_id: The ID of the user declining the invitation.
--
-- Returns: 
--    A game_status indicating the current status of the game after the invitation is declined.
--
-- Notes: 
--    - This function assumes the existence of the required tables and relationships among them.
--    - The game can either be 'abandoned', 'pending', or 'active' depending on the decisions of the players.
-- ================================================
CREATE OR REPLACE FUNCTION decline_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    game_creator_id UUID;
BEGIN
    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, p_game_id);

    -- Remove the user's association from the game
    DELETE FROM game_players 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total remaining players and the number of accepted invitations
    SELECT COUNT(*), COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Fetch the game creator's ID
    SELECT creator_id INTO game_creator_id FROM games WHERE id = p_game_id;

    -- Decide the game status
    IF accepted_count = total_players THEN
        game_state := CASE WHEN total_players = 1 THEN 'abandoned' ELSE 'active' END;
    ELSE
        game_state := 'pending';
    END IF;

    -- Early return if the game is either pending or abandoned
    IF game_state IN ('pending', 'abandoned') THEN
        UPDATE games 
        SET status = game_state, updated_at = (now() at time zone 'utc'::text)
        WHERE id = p_game_id;
        RETURN game_state;
    END IF;

    -- Insert the first round into the game_rounds table
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, 1, 'active', game_creator_id)
    RETURNING id INTO round_id;

    -- Random order for the players (starting with the game creator)
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    SELECT round_id, user_id, row_number() OVER ()
    FROM game_players 
    WHERE game_id = p_game_id
    ORDER BY CASE WHEN user_id = game_creator_id THEN 0 ELSE 1 END, RANDOM();

    -- Update the game's status in the games table
    UPDATE games 
    SET status = game_state, updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_game_id;

    -- Add notification for starting player
    PERFORM internal_add_notification(game_creator_id, 'game_move_turn', round_id);

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: get_active_game_by_id
-- Description: 
--    Fetches detailed information about an active game by its ID. 
--    This includes the current turn's player, letters used so far in the round, previous move's type, 
--    and its player, the maximum number of marks for the game, and the current round number.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--
-- Returns: 
--    A table containing details of the active game such as name, update time, current turn's player information,
--    letters used so far in the round, the previous move's type, its player, the maximum number of marks for the game, 
--    and the current round number.
--
-- Usage Example:
--    To get the details for a game with ID 'some_game_id':
--    SELECT * FROM get_active_game_by_id('some_game_id');
--
-- Notes: 
--    - Ensure that the provided game ID is valid. This function does not handle invalid game IDs or provide error messages for them.
--    - The function assumes the existence of the required tables and relationships among them.
--    - The function aggregates letters in a round, and if there are no letters, it returns an empty array.
--    - The previous move's player and its type are determined from the most recent entry in the round_moves table.
-- ================================================
CREATE OR REPLACE FUNCTION get_active_game_by_id(p_game_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "lettersSoFar" TEXT[],
    "previousMoveType" move_type,
    "previousPlayerId" UUID,
    "previousPlayerUsername" TEXT,
    "maxNumberOfMarks" INT,
    "currentRoundNumber" INT
) AS $$
BEGIN
    RETURN QUERY
    -- get previous move as CTE
    WITH prev_move_cte AS (
         SELECT 
             rm.game_round_id, 
             rm.type,
             rm.user_id 
         FROM round_moves rm
         WHERE rm.game_round_id IN (SELECT gr.id FROM game_rounds gr WHERE gr.game_id = p_game_id AND gr.status = 'active')
         ORDER BY rm.created_at DESC 
         LIMIT 1
    )
    -- Fetching detailed game data, including previous move.
    SELECT 
        g.id,
        g.name,
        COALESCE(MAX(rm.created_at), g.updated_at) as "updatedAt", -- fallback to game's updated_at if first round move
        p.id as "currentTurnProfileId",
        p.username as "currentTurnUsername",
        COALESCE(NULLIF(ARRAY_AGG(CASE WHEN rm.letter IS NOT NULL THEN rm.letter::text END ORDER BY rm.created_at), ARRAY[NULL::text]), ARRAY[]::text[]) AS "lettersSoFar", -- fallback to empty array if no letters
        prev_move.type as "previousMoveType",
        prev_move.user_id as "previousPlayerId",
        prev_profile.username as "previousPlayerUsername",
        g.max_number_of_marks as "maxNumberOfMarks",
        gr.round_number as "currentRoundNumber"
    FROM games g
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id
    LEFT JOIN prev_move_cte prev_move ON prev_move.game_round_id = gr.id
    LEFT JOIN profiles prev_profile ON prev_profile.id = prev_move.user_id
    WHERE g.id = p_game_id
    GROUP BY g.id, g.name, p.id, p.username, prev_move.type, prev_move.user_id, prev_profile.username, g.max_number_of_marks, gr.round_number, g.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: get_user_friends
-- Description: 
--    Retrieves a list of friends and their friendship status for a given user. 
--    The function checks both cases where the user is either the requester or the receiver of the friendship.
--
-- Parameters:
--    - p_user_id: The ID of the user for whom friends are being fetched.
--
-- Returns: 
--    A table containing friend IDs, their usernames, and the status of their friendship with the given user.
--
-- Usage Example:
--    To get the list of friends for user 'some_user_id':
--    SELECT * FROM get_user_friends('some_user_id');
--
-- Notes: 
--    - This function assumes that friendships are stored in a bi-directional manner, i.e., if A is a friend of B, then B is also a friend of A.
--    - Ensure that the provided user ID is valid. This function does not handle invalid user IDs or provide error messages for them.
-- ================================================
CREATE OR REPLACE FUNCTION get_user_friends(p_user_id UUID)
RETURNS TABLE("friendId" UUID, username TEXT, status friendship_status) AS $$
BEGIN
    RETURN QUERY 
    -- Select friends where the given user is the requester
    SELECT 
        f.receiver_id AS "friendId",
        p.username,
        f.status
    FROM 
        friendships f
    JOIN
        profiles p ON f.receiver_id = p.id
    WHERE 
        f.requester_id = p_user_id 
    UNION 
    -- Select friends where the given user is the receiver
    SELECT 
        f.requester_id AS "friendId",
        p.username,
        f.status
    FROM 
        friendships f
    JOIN
        profiles p ON f.requester_id = p.id
    WHERE 
        f.receiver_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_get_adjacent_players_order
-- Description: 
--    Retrieves the adjacent (previous and next) players based on a specific order 
--    for a given round and user. If the specified user is the first or last player 
--    in the sequence, the function wraps around, ensuring continuity in the game order.
--
-- Parameters:
--    - p_round_id: The ID of the round.
--    - p_user_id: The ID of the user for whom we want to find adjacent players.
--
-- Returns: 
--    A table containing UUIDs for the previous and next players.
-- ================================================
CREATE OR REPLACE FUNCTION internal_get_adjacent_players_order(p_round_id UUID, p_user_id UUID) 
RETURNS TABLE (prev_id UUID, next_id UUID) AS $$
BEGIN
    RETURN QUERY
    -- Define a CTE to capture each player's adjacent peers.
    WITH player_order AS (
        SELECT 
            player_id, 
            order_of_play,
            -- Fetch the player immediately preceding the current one in order.
            LAG(player_id) OVER (ORDER BY order_of_play) AS lag_id, 
            -- Fetch the player immediately succeeding the current one in order.
            LEAD(player_id) OVER (ORDER BY order_of_play) AS lead_id 
        FROM round_player_order
        WHERE round_id = p_round_id
    )
    SELECT 
        -- Provide the last player as a fallback when there's no predecessor.
        COALESCE(lag_id, (SELECT player_id FROM player_order ORDER BY order_of_play DESC LIMIT 1)) AS prev_id,
        -- Provide the first player as a fallback when there's no successor.
        COALESCE(lead_id, (SELECT player_id FROM player_order ORDER BY order_of_play ASC LIMIT 1)) AS next_id
    FROM player_order
    WHERE player_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_set_new_player_round_order
-- Description: 
--    Establishes the order of play for a new game round. The order is determined based 
--    on the previous round's sequence but starts with the player who initiated the new round.
--
-- Parameters:
--    - p_new_round_id: The ID of the new round.
--    - p_starting_player_id: The ID of the player who starts the new round.
--    - p_current_round_id: The ID of the current or previous round.
--
-- Returns: 
--    VOID - This function updates the database but does not return any value.
--
-- Note: 
--    The function makes use of PostgreSQL arrays to manipulate the order of players efficiently.
-- ================================================
CREATE OR REPLACE FUNCTION internal_set_new_player_round_order(
    p_new_round_id UUID, 
    p_starting_player_id UUID, 
    p_current_round_id UUID) 
RETURNS VOID AS $$
DECLARE 
    player_orders UUID[];
    order_idx INT;
BEGIN
    -- Extract ordered player IDs from the current round and store in an array.
    SELECT ARRAY_AGG(player_id ORDER BY order_of_play) 
    INTO player_orders 
    FROM round_player_order 
    WHERE round_id = p_current_round_id;

    -- Locate the position of the starting player in the retrieved order.
    FOR i IN 1..array_length(player_orders, 1) LOOP
        IF player_orders[i] = p_starting_player_id THEN
            order_idx := i;
            EXIT;
        END IF;
    END LOOP;

    -- Rearrange the order: Position the starting player at the front,
    -- followed by subsequent players, then those before the starter.
    player_orders := ARRAY_CAT(
                        ARRAY[player_orders[order_idx]] || 
                        player_orders[order_idx+1:array_length(player_orders, 1)], 
                        player_orders[1:order_idx-1]
                     );

    -- Record the redefined order for the new round in the database.
    FOR i IN 1..array_length(player_orders, 1) LOOP
        INSERT INTO round_player_order(round_id, player_id, order_of_play)
        VALUES (p_new_round_id, player_orders[i], i);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_increment_and_get_player_marks
-- Description: 
--    Increments the marks/points for a specified player within a given game.
--    After updating the score, the function then returns the new marks total.
--
-- Parameters:
--    - p_game_id: The ID of the game where the player's marks need to be updated.
--    - p_user_id: The ID of the player whose marks are to be incremented.
--
-- Returns: 
--    INTEGER - The updated marks of the player after the increment.
--
-- Note: 
--    The function performs an atomic update-then-fetch operation, ensuring accurate mark retrieval.
-- ================================================
CREATE OR REPLACE FUNCTION internal_increment_and_get_player_marks(p_game_id UUID, p_user_id UUID) 
RETURNS INTEGER AS $$
DECLARE
    updated_marks INTEGER;
BEGIN
    -- Increment the player's marks for the specified game.
    UPDATE game_players 
    SET marks = marks + 1
    WHERE game_id = p_game_id AND user_id = p_user_id
    RETURNING marks INTO updated_marks;
    
    -- Return the newly updated marks value.
    RETURN updated_marks;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_check_and_update_game_status_by_marks
-- Description: 
--    Evaluates if a player has achieved the maximum allowed marks in a game.
--    If so, it updates the player's status to 'out' and checks the game's overall status.
--    If only one player remains active, the game is marked as 'finished' and that player is set as the winner.
--
-- Parameters:
--    - p_game_id: The ID of the game to check and potentially update.
--    - p_user_id: The ID of the player whose marks are being evaluated.
--    - p_max_marks: The number of marks the player has currently achieved.
--
-- Returns: 
--    BOOLEAN - TRUE if the game has been finished, otherwise FALSE.
--
-- Note: 
--    This function plays a crucial role in progressing and potentially concluding a game based on player performance.
-- ================================================
CREATE OR REPLACE FUNCTION internal_check_and_update_game_status_by_marks(p_game_id UUID, p_user_id UUID, p_max_marks INTEGER) 
RETURNS BOOLEAN AS $$
DECLARE
    active_players_count INT;
BEGIN
    -- Determine if the player has achieved the maximum permissible marks.
    IF p_max_marks = (SELECT max_number_of_marks FROM games WHERE id = p_game_id) THEN
        -- Transition the player's status to 'out' since they've hit the mark cap.
        UPDATE game_players 
        SET status = 'out'
        WHERE game_id = p_game_id AND user_id = p_user_id;

        -- Quantify the number of players still in the 'active' state.
        SELECT COUNT(*) INTO active_players_count
        FROM game_players
        WHERE game_id = p_game_id AND status = 'active';

        -- If only a single active player persists, the game is deemed as 'finished'.
        IF active_players_count = 1 THEN
            -- Update the game's status and pinpoint the victor.
            UPDATE games
            SET status = 'finished', 
                winner_id = (SELECT user_id FROM game_players WHERE game_id = p_game_id AND status = 'active'), 
                updated_at = now()
            WHERE id = p_game_id;
            
            RETURN TRUE; -- Signifies the conclusion of the game.
        END IF;
    END IF;

    -- If not already returned, it means the game persists.
    RETURN FALSE; 
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_start_new_round
-- Description: 
--    Concludes the existing round and initiates a new one for a particular game. 
--    The new round starts with the designated starting player and has a round number incremented by one from the previous round.
--
-- Parameters:
--    - p_game_id: The ID of the game for which the new round is being initiated.
--    - p_user_id: The ID of the user triggering the start of the new round.
--    - p_current_round_id: The ID of the round that's currently in progress.
--    - p_current_round_number: The number of the round that's currently in progress.
--    - p_starting_player_id: The ID of the player who should initiate the new round.
--
-- Returns: 
--    UUID - The ID of the newly initiated round.
--
-- Note: 
--    It's imperative to ensure that the prior round is concluded before initiating a new one using this function.
-- ================================================
CREATE OR REPLACE FUNCTION internal_start_new_round(p_game_id UUID, p_user_id UUID, p_current_round_id UUID, p_current_round_number INT, p_starting_player_id UUID) 
RETURNS UUID AS $$
DECLARE
    new_round_id UUID;
BEGIN
    -- Initiate a new round, incrementing its number by one from the prior round, and assign the designated starting player. Fetch the ID of this new round.
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, p_current_round_number + 1, 'active', p_starting_player_id)
    RETURNING id INTO new_round_id;

    -- Return the ID of the newly created round.
    RETURN new_round_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_record_round_move
-- Description: 
--    Records a move made by a player during a specific round of the game.
--    A move consists of the type of move ('add_letter', 'give_up', etc.) and potentially a letter if it's an 'add_letter' move.
--
-- Parameters:
--    - p_game_round_id: The ID of the round in which the move is being made.
--    - p_user_id: The ID of the user/player making the move.
--    - p_move_type: Specifies the type of the move ('add_letter', 'give_up', etc.).
--    - p_value (optional): The letter or word being added if the move type is 'add_letter' or 'reveal_bluff'.
--
-- Returns: 
--    VOID - This function does not return any value; its purpose is to insert a record into the 'round_moves' table.
--
-- Note: 
--    Ensure that the move type and any associated data (like the letter) are valid before calling this function.
-- ================================================
CREATE OR REPLACE FUNCTION internal_record_round_move(p_game_round_id UUID, p_user_id UUID, p_move_type move_type, p_value TEXT DEFAULT NULL) 
RETURNS VOID AS $$
BEGIN
    IF p_move_type = 'reveal_bluff' OR p_move_type = 'claim_finished_word' THEN
        INSERT INTO round_moves (game_round_id, user_id, type, word)
        VALUES (p_game_round_id, p_user_id, p_move_type, p_value);

    ELSIF p_move_type = 'add_letter' AND LENGTH(p_value) = 1 THEN
        INSERT INTO round_moves (game_round_id, user_id, type, letter)
        VALUES (p_game_round_id, p_user_id, p_move_type, p_value);

    ELSE
        INSERT INTO round_moves (game_round_id, user_id, type)
        VALUES (p_game_round_id, p_user_id, p_move_type);
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ================================================
-- Function: internal_finish_current_round
-- Description: 
--    Marks a specific game round as finished by updating its status. Additionally, it sets the 
--    player who made the last move in the round and the timestamp when the round was updated.
--
-- Parameters:
--    - p_current_round_id: The ID of the round to be finished.
--    - p_user_id: The ID of the user who made the last move in the round.
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to update the status and relevant fields in the 'game_rounds' table.
--
-- Usage Example:
--    To finish a round with ID 'some_round_id' where the last move was made by a user with ID 'some_user_id':
--    CALL internal_finish_current_round('some_round_id', 'some_user_id');
--
-- Note: 
--    Ensure that the round and user IDs are valid before calling this function. This function will not handle invalid round/user ID errors.
-- ================================================
CREATE OR REPLACE FUNCTION internal_finish_current_round(p_current_round_id UUID, p_user_id UUID) 
RETURNS VOID AS $$
BEGIN
    -- Update the round's status to 'finished', set the last player who moved, and update the timestamp
    UPDATE game_rounds
    SET status = 'finished', 
        last_moved_user_id = p_user_id, 
        current_player_id = NULL, 
        updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_current_round_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: add_letter_move
-- Description: 
--    Handles a player's 'add_letter' move and sets the next player to current player.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--    - p_letter: The letter being submitted.
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- Usage Example:
--    To submit a letter 'A' in game 'some_game_id' by user 'some_user_id':
--    CALL add_letter_move('some_game_id', 'some_user_id', 'A');
--
-- ================================================
CREATE OR REPLACE FUNCTION add_letter_move(p_game_id UUID, p_user_id UUID, p_letter CHAR(1))
RETURNS VOID AS $$
DECLARE
    next_player_id UUID;          -- ID of the next player in the game
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Fetch the next and previous player's order
    SELECT next_id INTO next_player_id
    FROM internal_get_adjacent_players_order(current_round_id, p_user_id);

    -- Update the round details
    UPDATE game_rounds
    SET last_moved_user_id = p_user_id, current_player_id = next_player_id, updated_at = (now() at time zone 'utc'::text)
    WHERE id = current_round_id;

    -- Record the add-letter move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'add_letter', p_letter);
    -- Remove notification for current user
    PERFORM internal_delete_notification(p_user_id, current_round_id);
    -- Add notification for next user
    PERFORM internal_add_notification(next_player_id, 'game_move_turn', current_round_id);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_perform_http_get_from_server
-- Description: 
--    Internal function to fetch data from an external API endpoint, 
--    intended to be called from another database function.
--
-- Parameters:
--    - p_api_endpoint: The URL endpoint of the external API to call.
--
-- Returns: 
--    A RECORD containing:
--    - status: 'success' or 'error'
--    - data: Content received (HTML or JSON)
--    - message: Error message (if applicable)
--
-- Notes: 
--    - This function assumes that the "http" extension is enabled.
--    - The function only performs a GET request.
-- ================================================
CREATE OR REPLACE FUNCTION internal_perform_http_get_from_server(
    p_api_endpoint TEXT
) 
RETURNS TABLE (
    status TEXT, 
    data TEXT, 
    message TEXT
) AS $$
DECLARE
    api_response RECORD;  -- To hold the response from the API call.
BEGIN
    -- Use the http_get function to fetch the content.
    SELECT 
        hg."status",
        hg."content"
    INTO api_response
    FROM http_get(p_api_endpoint) AS hg;

    -- Process the content based on the desired content type.
    data := api_response.content;

    -- If the status is 200 (HTTP OK), return the processed content.
    IF api_response.status = 200 THEN
        status := 'success';
        message := NULL;
    ELSE
        status := 'error';
        message := format('Failed with HTTP status: %s', api_response.status);
    END IF;

    RETURN NEXT;

EXCEPTION
    WHEN OTHERS THEN
        status := 'error';
        message := format('Error in "internal_perform_http_get_from_server": %s', SQLERRM);
        RETURN NEXT;

END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: claim_finished_word_move
-- Description: 
--    Validates a completed word using an external API to determine its validity. 
--    Marks the current or previous player based on the word's validity.
--
-- Parameters:
--    - p_game_id: The ID of the game in which the word needs validation.
--    - p_saol_base_url: The URL endpoint of the external API to call for word validation.
--    - p_user_id: The ID of the current player.
--
-- Returns: 
--    A table with "isValidWord" (boolean indicating word validity).
--
-- ================================================
CREATE OR REPLACE FUNCTION claim_finished_word_move(
    p_game_id UUID,
    p_saol_base_url TEXT,
    p_user_id UUID
) 
RETURNS TABLE ("isValidWord" BOOLEAN) AS $$
DECLARE
    round_letters TEXT;           -- Concatenated letters from the active round to form the word
    prev_player_id UUID;          -- ID of the previous player in the game
    starting_player_id UUID;      -- ID of of the player that should start next round
    current_max_marks INT;        -- Current maximum marks a player has
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
    new_round_id UUID;            -- ID of the new round (if created)
    affected_player_id UUID;      -- Player ID who will be affected based on word validity
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Fetch the previous player's order
    SELECT prev_id INTO prev_player_id
    FROM internal_get_adjacent_players_order(current_round_id, p_user_id);

    -- Get all letters for the active round.
    round_letters := internal_get_round_letters(current_round_id);

    -- Record 'claim_finished_word' move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'claim_finished_word', round_letters);

    IF internal_validate_word_with_saol(p_saol_base_url, round_letters) THEN
        -- Valid word ✅
        -- Previous player will get a mark
        -- Current player starts new round
        affected_player_id := prev_player_id;
        starting_player_id := p_user_id;
        "isValidWord" := TRUE;
    ELSE
        -- Not a valid word ❌
        -- Current player will get a mark
        -- Previous player starts new round
        affected_player_id := p_user_id;
        starting_player_id := prev_player_id;
        "isValidWord" := FALSE;
    END IF;
    
    -- Common operations based on affected player:

    -- Remove notification for current user
    PERFORM internal_delete_notification(p_user_id, current_round_id);
    -- Update the marks for the affected player
    current_max_marks := internal_increment_and_get_player_marks(p_game_id, affected_player_id);
    -- Check the game's status and make necessary updates
    IF internal_check_and_update_game_status_by_marks(p_game_id, affected_player_id, current_max_marks) THEN
        -- Game is finished, no new rounds initiated
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
    ELSE
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
        -- Start a new round, fetching the ID of the new round
        new_round_id := internal_start_new_round(p_game_id, p_user_id, current_round_id, current_round_number, starting_player_id);
        -- Set player order for the new round
        PERFORM internal_set_new_player_round_order(new_round_id, starting_player_id, current_round_id);
         -- Add notification for next user
        PERFORM internal_add_notification(starting_player_id, 'game_move_turn', new_round_id);
    END IF;
RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: call_bluff_move
-- Description: 
--    Handles a player's 'call_bluff' move. This shall be called when a player thinks the previous player is bluffing.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- ================================================
CREATE OR REPLACE FUNCTION call_bluff_move(p_game_id UUID, p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;          -- ID of the previous player in the game
    current_round_id UUID;        -- ID of the active round
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id INTO current_round_id FROM current_round;

    -- Fetch the previous player's id
    SELECT prev_id INTO prev_player_id
    FROM internal_get_adjacent_players_order(current_round_id, p_user_id);

    -- Update the round details
    UPDATE game_rounds
    SET last_moved_user_id = p_user_id, current_player_id = prev_player_id, updated_at = (now() at time zone 'utc'::text)
    WHERE id = current_round_id;    
    -- Record the call-bluff move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'call_bluff');
    -- Remove and add new notification
    PERFORM internal_delete_notification(p_user_id, current_round_id);
    PERFORM internal_add_notification(prev_player_id, 'game_move_turn', current_round_id);
END;
$$ LANGUAGE plpgsql;

-- Basic idea:
-- user gives up:
--     mark user
--     finish game or start new round with previous user
-- 
-- user submits word;
--     validate word
--     word is valid:
--         mark previous user
--         finish game or start new round with current user
--     word is not valid:
--         mark current user
--         finish game or start new round with previous user
-- ================================================
-- Function: reveal_bluff_move
-- Description: 
--    Handles a player's 'reveal_bluff' move. This can be executed when previous user has called out current player for bluffing.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--    - p_api_url: API url to SAOL
--    - p_word: The word the user was thinking about, placing their last letter
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- ================================================
CREATE OR REPLACE FUNCTION reveal_bluff_move(p_game_id UUID, p_user_id UUID, p_saol_base_api_url TEXT, p_word TEXT)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;          -- ID of the previous player in the game
    next_player_id UUID;          -- ID of the next player in the game
    starting_player_id UUID;      -- ID of of the player that should start next round
    current_max_marks INT;        -- Current maximum marks a player has
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
    new_round_id UUID;            -- ID of the new round (if created)
    affected_player_id UUID;      -- Player ID who will be affected based on word validity
    round_letters TEXT;           -- Concatenated letters from the active round to form the word
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Fetch the next and previous player's order
    SELECT prev_id, next_id INTO prev_player_id, next_player_id
    FROM internal_get_adjacent_players_order(current_round_id, p_user_id);

    -- Get all letters for the active round.
    round_letters := internal_get_round_letters(current_round_id);
    -- Check that submitted word starts with letters in round
    IF LEFT(p_word, LENGTH(round_letters)) = round_letters THEN
        -- Validate word with SAOL
        IF internal_validate_word_with_saol(p_saol_base_api_url, p_word) THEN
            -- Valid word ✅
            -- Next player will get a mark
            -- Current player should start new round
            affected_player_id := next_player_id;
            starting_player_id := p_user_id;
        ELSE
            -- Not a valid word ❌
            -- Current player will get a mark
            -- Next player (player that called bluff) should start new round
            affected_player_id := p_user_id;
            starting_player_id := next_player_id;
        END IF;
    ELSE
        -- Not a valid word ❌
        -- Current player will get a mark
        -- Next player (player that called bluff) should start new round
        affected_player_id := p_user_id;
        starting_player_id := next_player_id;
    END IF;

    -- Common operations based on affected player:

    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, current_round_id);

    -- Record the reveal_bluff move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'reveal_bluff', p_word);
    -- Update the marks for the affected player
    current_max_marks := internal_increment_and_get_player_marks(p_game_id, affected_player_id);
        -- Check the game's status and make necessary updates
    IF internal_check_and_update_game_status_by_marks(p_game_id, affected_player_id, current_max_marks) THEN
        -- Game is finished, no new rounds initiated
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
    ELSE
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
        -- Start a new round, fetching the ID of the new round
        new_round_id := internal_start_new_round(p_game_id, p_user_id, current_round_id, current_round_number, starting_player_id);
        -- Set player order for the new round
        PERFORM internal_set_new_player_round_order(new_round_id, starting_player_id, current_round_id);
        -- Add notification for next player
        PERFORM internal_add_notification(starting_player_id, 'game_move_turn', new_round_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_get_round_letters
-- Description: 
--    Internal function to fetch the concatenated letters for a given game round, 
--    based on the `round_moves` table.
--
-- Parameters:
--    - p_game_round_id: The ID of the game round.
--
-- Returns: 
--    A TEXT containing the concatenated string of letters for the given game round.
--
-- Notes: 
--    - Only letters with type 'add_letter' are considered.
-- ================================================
CREATE OR REPLACE FUNCTION internal_get_round_letters(
    p_game_round_id UUID
) 
RETURNS TEXT AS $$
DECLARE
    round_letters TEXT;  -- To hold the concatenated string of letters.
BEGIN
    SELECT string_agg(letter, '' ORDER BY created_at) INTO round_letters
    FROM round_moves
    WHERE game_round_id = p_game_round_id AND type = 'add_letter';

    RETURN round_letters;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in "internal_get_round_letters": %', SQLERRM;

END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_validate_word_with_saol
-- Description: 
--    Validates if a given word is valid by making a request to SAOL
--    and checking the response. The result is then used to determine which player
--    is affected by the validation outcome.
--
-- Parameters:
--    - p_api_url: The base URL endpoint of the external API.
--    - word: The word to validate.
--    - p_user_id: The ID of the current player.
--    - next_player_id: The ID of the next player.
--
-- Returns: 
--    BOOLEAN indicating if the word is valid or not.
--    TRUE: Word is valid.
--    FALSE: Word is not valid.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_validate_word_with_saol(
    p_api_url TEXT,
    word TEXT
) 
RETURNS BOOLEAN AS $$
DECLARE
    api_result RECORD;          -- To hold the response from the API call.
    valid_word BOOLEAN;         -- Flag to determine if the word is valid or not.
BEGIN
    -- Fetch word validation from SAOL
    api_result := internal_perform_http_get_from_server(format('%s%s', p_api_url, word));

    -- Check if word is valid based on the response
    IF api_result.data LIKE format('%%Sökningen på <strong>%s</strong> i SAOL gav inga svar%%', word) THEN
        valid_word := FALSE;
    ELSE
        valid_word := TRUE;
    END IF;

    RETURN valid_word;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in "internal_validate_word": %', SQLERRM;

END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: give_up_move
-- Description: 
--    Handles a player's 'give_up' move. This can be called intead of submitting a letter, or when a user gets called out for bluffing.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- ================================================
CREATE OR REPLACE FUNCTION give_up_move(p_game_id UUID, p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;          -- ID of the previous player in the game
    current_max_marks INT;        -- Current maximum marks a player has
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
    new_round_id UUID;            -- ID of the new round (if created)
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Record the give-up move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'give_up');
    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, current_round_id);
    -- Update the marks for the player
    current_max_marks := internal_increment_and_get_player_marks(p_game_id, p_user_id);

    -- Check the game's status and make necessary updates
    IF internal_check_and_update_game_status_by_marks(p_game_id, p_user_id, current_max_marks) THEN
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
        RETURN; -- Game has finished, so exit the function
        -- TODO: Handle game archiving, new function or trigger?
    END IF;

    -- Finish the current round
    PERFORM internal_finish_current_round(current_round_id, p_user_id);
    -- Start a new round, fetching the ID of the new round
    new_round_id := internal_start_new_round(p_game_id, p_user_id, current_round_id, current_round_number, prev_player_id);
    -- Set player order for the new round
    PERFORM internal_set_new_player_round_order(new_round_id, prev_player_id, current_round_id);
    -- Add notification for next user
    PERFORM internal_add_notification(prev_player_id, 'game_move_turn', new_round_id);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_add_notification
-- Description: 
--    Internal function that inserts new notifications table so clients can subscribe to changes and make updates.
--
-- Parameters:
--    - p_user_id: The ID of the player receving the update.
--    - p_type: Type of notification.
--    - p_reference_id: A generic reference parameter, e.g. when creating, it's the game_id.
--    - p_message: Optional notification message.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_add_notification(p_user_id UUID, p_type notification_type, p_reference_id UUID, p_message TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO notifications(user_id, type, reference_id, message)
    VALUES (p_user_id, p_type, p_reference_id, p_message);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: internal_delete_notification
-- Description: 
--    Internal function to mark a notification as read.
--
-- Parameters:
--    - p_user_id: The ID of the player receving the update.
--    - p_reference_id: A generic reference parameter, e.g. when creating, it's the game_id.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_delete_notification(p_user_id UUID, p_reference_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM notifications
    WHERE user_id = p_user_id AND reference_id = p_reference_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: get_base_game_stats_by_id
-- Description: 
--    Retrieves basic game statistics for a given game ID. 
--    The details fetched include the current player's information and the standings of all players.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--    - p_user_id: The ID of the logged in user.
--
-- Returns: 
--    A table containing details of the current player's ID and username,
--    as well as an aggregated list of player standings in the game.
--
-- Usage Example:
--    To get the basic statistics for a game with ID 'some_game_id':
--    SELECT * FROM get_base_game_stats_by_id('some_game_id', 'some_user_id');
--
-- Notes: 
--    - The standings for players are aggregated as a JSONB array for easier handling and interpretation.
-- ================================================
CREATE OR REPLACE FUNCTION get_base_game_stats_by_id(p_game_id UUID, p_user_id UUID)
RETURNS TABLE(
  "currentPlayerId" UUID,
  "currentPlayerUsername" TEXT,
  "gameStatus" game_status,
  "roundStatus" game_status,
  "standings" JSONB[]
) AS $$
BEGIN
    RETURN QUERY 
    WITH game_details AS (
        SELECT
            gr.current_player_id AS "currentPlayerId",
            COALESCE(p.username, 'N/A') AS "currentPlayerUsername",
            g.status AS "gameStatus",
            gr.status AS "roundStatus"
        FROM game_rounds gr
        LEFT JOIN profiles p ON gr.current_player_id = p.id
        JOIN games g ON gr.game_id = g.id
        WHERE gr.game_id = p_game_id
        LIMIT 1
    ),
    player_standings AS (
        SELECT
            ARRAY_AGG(
                jsonb_build_object(
                    'playerId', gp.user_id,
                    'username', p.username,
                    'marks', gp.marks
                )
            ) AS "standingsData"
        FROM game_players gp
        JOIN profiles p ON gp.user_id = p.id
        WHERE gp.game_id = p_game_id
    )
    SELECT
        gd."currentPlayerId",
        gd."currentPlayerUsername",
        gd."gameStatus",
        gd."roundStatus",
        ps."standingsData" AS "standings"
    FROM game_details gd 
    CROSS JOIN player_standings ps;
END;
$$
LANGUAGE plpgsql;

-- ================================================
-- Function: get_game_stats_by_id
-- Description: 
--    Fetches comprehensive game statistics for a particular game ID. 
--    The function provides detailed insights including the current turn's player, most recent move details, 
--    game standings, and a history of moves.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--    - p_user_id: The ID of the logged in user.
--
-- Returns: 
--    A table with details about the current player's turn, move type, letter used, word formed, game standings, 
--    and a chronological list of round moves.
--
-- Usage Example:
--    To get comprehensive game stats for a game with ID 'some_game_id':
--    SELECT * FROM get_game_stats_by_id('some_game_id', 'some_user_id');
--
-- Notes:
--    - For move details, the function returns the most recent move. For round details, a historical list of moves is provided.
-- ================================================
CREATE OR REPLACE FUNCTION get_game_stats_by_id(p_game_id UUID, p_user_id UUID)
RETURNS TABLE(
  "currentPlayerId" UUID,
  "currentPlayerUsername" TEXT,
  "gameStatus" game_status,
  "roundStatus" game_status,
  "moveType" move_type,
  "letter" CHAR(1),
  "word" TEXT,
  "standings" JSONB[],
  "rounds" JSONB[]
) AS $$
BEGIN
    RETURN QUERY 
    WITH base_info AS (
        SELECT * FROM get_base_game_stats_by_id(p_game_id, p_user_id)
    ),
    move_details AS (
        SELECT 
            rm.type AS "moveType",
            rm.letter,
            rm.word
        FROM round_moves rm 
        JOIN game_rounds gr ON gr.id = rm.game_round_id
        WHERE gr.game_id = p_game_id
        ORDER BY rm.created_at DESC
        LIMIT 1
    ),
    moves AS (
        SELECT
            gr.round_number AS "roundNumber",
            jsonb_build_object(
                'playerId', rm.user_id,
                'username', (SELECT username FROM profiles WHERE id = rm.user_id),
                'moveType', rm.type,
                'createdAt', rm.created_at,
                'letter', rm.letter,
                'word', rm.word
            ) AS "moveData"
        FROM game_rounds gr
        JOIN round_moves rm ON gr.id = rm.game_round_id
        WHERE gr.game_id = p_game_id
    ),
    aggregated_moves AS (
        SELECT 
            "roundNumber",
            ARRAY_AGG("moveData" ORDER BY "moveData"->>'createdAt' DESC) AS moves
        FROM moves
        GROUP BY "roundNumber"
    )
    SELECT
        bi."currentPlayerId",
        bi."currentPlayerUsername",
        bi."gameStatus",
        bi."roundStatus",
        md."moveType",
        md.letter,
        md.word,
        bi."standings",
        ARRAY(
            SELECT jsonb_build_object('roundNumber', am."roundNumber", 'moves', am.moves)
            FROM aggregated_moves am
            ORDER BY am."roundNumber" DESC
        ) AS "rounds"
    FROM base_info bi
    CROSS JOIN move_details md;
END;
$$
LANGUAGE plpgsql;
