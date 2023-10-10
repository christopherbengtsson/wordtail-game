CREATE OR REPLACE FUNCTION submit_letter(p_game_id UUID, p_user_id UUID, letter CHAR(1) DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;
    next_player_id UUID;
    active_players_count INT;
    current_max_marks INT;
    current_round_id UUID;
    current_round_number INT;
BEGIN
    -- Fetching Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Determine Player Order for the Current Round
    WITH player_order AS (
        SELECT 
            player_id, 
            LEAD(player_id) OVER (ORDER BY order_of_play) as next_id,  -- Get the player who plays after the current player
            LAG(player_id) OVER (ORDER BY order_of_play) as prev_id    -- Get the player who played before the current player
        FROM round_player_order
        WHERE round_id = current_round_id
    )
    SELECT prev_id, next_id INTO prev_player_id, next_player_id 
    FROM player_order 
    WHERE player_id = p_user_id;

    -- If User Submits an Empty Letter, Handle the Give Up Action
    IF letter IS NULL THEN
        -- Record the give up move
        INSERT INTO round_moves (game_round_id, user_id, type)
        VALUES (current_round_id, p_user_id, 'give_up');

        -- Update the marks for the player and check if they're out of the game
        WITH player_update AS (
            UPDATE game_players 
            SET marks = marks + 1
            WHERE game_id = p_game_id AND user_id = p_user_id
            RETURNING marks
        )
        SELECT marks INTO current_max_marks FROM player_update;

        -- Player Action based on marks count and game condition
        IF current_max_marks = (SELECT max_number_of_marks FROM games WHERE id = p_game_id) THEN
            -- Update player status to 'out'
            UPDATE game_players 
            SET status = 'out'
            WHERE game_id = p_game_id AND user_id = p_user_id;

            -- Check if only one active player remains
            SELECT COUNT(*) INTO active_players_count
            FROM game_players
            WHERE game_id = p_game_id AND status = 'active';

            IF active_players_count = 1 THEN
                -- Finish the game and set the winner
                UPDATE games
                SET status = 'finished', winner_id = (SELECT user_id FROM game_players WHERE game_id = p_game_id AND status = 'active'), updated_at = now()
                WHERE id = p_game_id;
                RETURN;
            END IF;
        END IF;

        -- Set the status of the current round to 'finished' and update the last_moved_user_id
        UPDATE game_rounds
        SET status = 'finished', last_moved_user_id = p_user_id, current_player_id = NULL, updated_at = (now() at time zone 'utc'::text)
        WHERE id = current_round_id;

        -- Start a new round with the previous player
        IF prev_player_id IS NULL THEN
            SELECT player_id INTO prev_player_id
            FROM round_player_order
            WHERE round_id = current_round_id
            ORDER BY order_of_play DESC LIMIT 1;
        END IF;
        
        INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
        VALUES (p_game_id, current_round_number + 1, 'active', prev_player_id);

    -- If User Submits a Letter
    ELSE
        -- Fallback to the first player if next_player_id is NULL
        IF next_player_id IS NULL THEN
            SELECT player_id INTO next_player_id
            FROM round_player_order
            WHERE round_id = current_round_id
            ORDER BY order_of_play ASC LIMIT 1;
        END IF;

        -- Update the round details with new move
        UPDATE game_rounds
        SET last_moved_user_id = p_user_id, current_player_id = next_player_id, updated_at = (now() at time zone 'utc'::text)
        WHERE id = current_round_id;

        -- Insert the move in the round_moves table
        INSERT INTO round_moves (game_round_id, user_id, type, letter)
        VALUES (current_round_id, p_user_id, 'add_letter', letter);
    END IF;
END;
$$ LANGUAGE plpgsql;
