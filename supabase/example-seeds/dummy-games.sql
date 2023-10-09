-- To be run in Supabase SQL Editor, change UUIDs with real users.
DO $$ 
DECLARE 
    user1_id UUID := '4e32e06d-fe2c-40b0-ab42-7c5ebde83749';
    user2_id UUID := 'f554a4ae-ba25-4139-9ec9-8a88bee65b2f';
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

-- Game Stats 
-- For User1
INSERT INTO user_stats (user_id, games_played, games_won, avg_place)
VALUES 
    (user1_id, 2, 0, 1.5); -- User1 has played 2 games, won 0, and has an average place of 1.5

-- For User2
INSERT INTO user_stats (user_id, games_played, games_won, avg_place)
VALUES 
    (user2_id, 2, 1, 1); -- User2 has played 2 games, won 1, and has an average place of 1

-- round_player_order
-- Order for Round 1 in Game1
INSERT INTO round_player_order (round_id, player_id, order_of_play)
VALUES 
    (round1_id, user1_id, 1), -- User1 plays first in Round 1 of Game1
    (round1_id, user2_id, 2); -- User2 plays second in Round 1 of Game1

-- Order for Round 1 in Game2
INSERT INTO round_player_order (round_id, player_id, order_of_play)
VALUES 
    (round2_id, user2_id, 1), -- User2 plays first in Round 1 of Game2
    (round2_id, user1_id, 2); -- User1 plays second in Round 1 of Game2

END $$;
