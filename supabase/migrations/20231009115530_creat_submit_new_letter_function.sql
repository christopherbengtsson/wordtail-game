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
    -- Get the current round ID and round_number for the game
    SELECT id, round_number INTO current_round_id, current_round_number
    FROM game_rounds 
    WHERE game_id = p_game_id
    ORDER BY created_at DESC LIMIT 1;

    -- Determine the previous player for the current round
    SELECT player_id INTO prev_player_id
    FROM round_player_order
    WHERE round_id = current_round_id AND order_of_play = (
        SELECT order_of_play - 1
        FROM round_player_order
        WHERE round_id = current_round_id AND player_id = p_user_id
    );

    -- If not found, fallback to the last player
    IF prev_player_id IS NULL THEN
        SELECT player_id INTO prev_player_id
        FROM round_player_order
        WHERE round_id = current_round_id
        ORDER BY order_of_play DESC LIMIT 1;
    END IF;

    -- Determine the next player for the current round
    SELECT player_id INTO next_player_id
    FROM round_player_order
    WHERE round_id = current_round_id AND order_of_play = (
        SELECT order_of_play + 1
        FROM round_player_order
        WHERE round_id = current_round_id AND player_id = p_user_id
    );

    -- If next player not found, fallback to the first player
    IF next_player_id IS NULL THEN
        SELECT player_id INTO next_player_id
        FROM round_player_order
        WHERE round_id = current_round_id
        ORDER BY order_of_play ASC LIMIT 1;
    END IF;

    -- If the user submits an empty letter
    IF letter IS NULL THEN
        -- Update the marks for the player
        UPDATE game_players 
        SET marks = marks + 1
        WHERE game_id = p_game_id AND user_id = p_user_id
        RETURNING marks INTO current_max_marks;

        -- Check if player is out of the game
        IF current_max_marks = (SELECT max_number_of_marks FROM games WHERE id = p_game_id) THEN
            UPDATE game_players 
            SET status = 'out'
            WHERE game_id = p_game_id AND user_id = p_user_id;

            -- Check if only one active player remains
            SELECT COUNT(*) INTO active_players_count
            FROM game_players
            WHERE game_id = p_game_id AND status = 'active';

            IF active_players_count = 1 THEN
                UPDATE games
                SET status = 'finished', winner_id = (SELECT user_id FROM game_players WHERE game_id = p_game_id AND status = 'active')
                WHERE id = p_game_id;
                RETURN;
            ELSE
                -- Previous player starts a new round
                INSERT INTO game_rounds (game_id, round_number, status, current_player_id, last_moved_user_id)
                VALUES (p_game_id, current_round_number + 1, 'active', prev_player_id, p_user_id);
            END IF;
        ELSE
            -- Previous player starts a new round
            INSERT INTO game_rounds (game_id, round_number, status, current_player_id, last_moved_user_id)
            VALUES (p_game_id, current_round_number + 1, 'active', prev_player_id, p_user_id);
        END IF;
    ELSE
        -- Update the last_moved_user_id and current_player_id for the current round
        UPDATE game_rounds
        SET last_moved_user_id = p_user_id, current_player_id = next_player_id
        WHERE id = current_round_id;

        -- Insert the move in the round_moves table
        INSERT INTO round_moves (game_round_id, user_id, type, letter)
        VALUES (current_round_id, p_user_id, 'add_letter', letter);
    END IF;
END;
$$ LANGUAGE plpgsql;
