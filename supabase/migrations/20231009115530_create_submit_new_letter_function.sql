-- ================================================
-- Function: submit_letter
-- Description: 
--    Handles a player's move in the game. This function can handle both scenarios when a player submits a letter 
--    or when they decide to give up (submitting a NULL letter). Depending on the move, the game's state and the 
--    player's marks are updated accordingly. Rounds may be concluded, and new rounds might be started based on the game logic.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--    - letter: The letter being submitted. If NULL, it means the player is giving up.
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- Usage Example:
--    To submit a letter 'A' in game 'some_game_id' by user 'some_user_id':
--    CALL submit_letter('some_game_id', 'some_user_id', 'A');
--    To signify that the user is giving up:
--    CALL submit_letter('some_game_id', 'some_user_id');
--
-- Note: 
--    Make sure game and user IDs are valid when calling this function. The function assumes valid IDs and does not handle invalid ID errors.
-- ================================================
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
