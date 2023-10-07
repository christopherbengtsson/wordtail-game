-- To be run in Supabase SQL Editor, change UUIDs with real users.

-- Setting User IDs as Variables for Easier Reference
DO $$ 
DECLARE 
    user1_id UUID := 'f3f50e71-9633-42d4-8642-7e517cf7d035';
    user2_id UUID := '30685d6b-bcfc-48a3-a8b3-2cfbfc96cd80';
    game1_id UUID := gen_random_uuid();
    game2_id UUID := gen_random_uuid();
    game3_id UUID := gen_random_uuid();
    round1_id UUID := gen_random_uuid();
    round2_id UUID := gen_random_uuid();

BEGIN

-- Games
-- Game 1: Finished Game
INSERT INTO games (id, name, status, starter_id, winner_id)
VALUES 
    (game1_id, 'Game1', 'finished', user1_id, user2_id);

-- Game 2: Active Game
INSERT INTO games (id, name, status, starter_id)
VALUES 
    (game2_id, 'Game2', 'active', user2_id);

-- Game 3: Pending Game
INSERT INTO games (id, name, status, starter_id)
VALUES 
    (game3_id, 'Game3', 'pending', user1_id);

-- Game Players
-- For Game1
INSERT INTO game_players (game_id, user_id, result_position, marks, status)
VALUES 
    (game1_id, user1_id, 2, 0, 'active'),
    (game1_id, user2_id, 1, 1, 'out');

-- For Game2
INSERT INTO game_players (game_id, user_id, marks, status)
VALUES 
    (game2_id, user1_id, 0, 'active'),
    (game2_id, user2_id, 0, 'active');

-- Game Players for Game3
INSERT INTO game_players (game_id, user_id, marks, status, invitation_status)
VALUES 
    (game3_id, user1_id, 0, 'active', 'accepted'), -- Creator is auto-accepted
    (game3_id, user2_id, 0, 'active', 'pending'); -- Other user is pending

-- Game Rounds
-- Rounds for Game1
INSERT INTO game_rounds (id, game_id, round_number, status, last_moved_user_id, current_player_id)
VALUES 
    (round1_id, game1_id, 1, 'finished', user2_id, user1_id);

-- Rounds for Game2
INSERT INTO game_rounds (id, game_id, round_number, status, last_moved_user_id, current_player_id)
VALUES 
    (round2_id, game2_id, 1, 'active', user1_id, user2_id);

-- Round Moves
-- Moves for Round 1 in Game1
INSERT INTO round_moves (game_round_id, user_id, type, letter)
VALUES 
    (round1_id, user1_id, 'add_letter', 'A'),
    (round1_id, user2_id, 'add_letter', 'B'),
    (round1_id, user1_id, 'add_letter', 'C'),
    (round1_id, user2_id, 'call_bluff', NULL);

-- Moves for Round 1 in Game2
INSERT INTO round_moves (game_round_id, user_id, type, letter)
VALUES 
    (round2_id, user2_id, 'add_letter', 'D'),
    (round2_id, user1_id, 'add_letter', 'E'),
    (round2_id, user2_id, 'add_letter', 'F');

-- Friendships (For the sake of seeding, let's assume both users are friends)
INSERT INTO friendships (requester_id, receiver_id, status)
VALUES 
    (user1_id, user2_id, 'accepted');

-- Notification for the pending game invitation
INSERT INTO notifications (user_id, type, reference_id, message, seen)
VALUES
    (user2_id, 'game_invite', game3_id, 'You have been invited to join Game3', FALSE);

END $$;
