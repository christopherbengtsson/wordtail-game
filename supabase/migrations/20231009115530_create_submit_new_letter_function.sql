CREATE OR REPLACE FUNCTION submit_letter(p_game_id UUID, p_user_id UUID, letter CHAR(1) DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;
    next_player_id UUID;
    active_players_count INT;
    current_max_marks INT;
    current_round_id UUID;
    current_round_number INT;
    new_round_id UUID;
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

    -- Handle when a user submits an empty letter
    IF letter IS NULL THEN
         -- Record the give-up move
        PERFORM internal_record_round_move(current_round_id, p_user_id, 'give_up');

        -- Update the marks for the player
        current_max_marks := internal_increment_and_get_player_marks(p_game_id, p_user_id);

        -- Check the game's status and make necessary updates
        IF internal_check_and_update_game_status(p_game_id, p_user_id, current_max_marks) THEN
            -- TODO: set round to finished
            RETURN; -- Game has finished, so exit the function
            -- TODO: Handle game archiving, new function or trigger?
        END IF;

        -- Finish the current round and start a new one, fetching the ID of the new round
        new_round_id := internal_finish_and_start_new_round(p_game_id, p_user_id, current_round_id, current_round_number, prev_player_id);

        -- Set player order for the new round
        PERFORM internal_set_new_player_round_order(new_round_id, prev_player_id, current_round_id);

    -- Handle when a user submits a letter
    ELSE
        -- Update the round details
        UPDATE game_rounds
        SET last_moved_user_id = p_user_id, current_player_id = next_player_id, updated_at = (now() at time zone 'utc'::text)
        WHERE id = current_round_id;

        -- Record the add-letter move
        PERFORM internal_record_round_move(current_round_id, p_user_id, 'add_letter', letter);
    END IF;
END;
$$ LANGUAGE plpgsql;
