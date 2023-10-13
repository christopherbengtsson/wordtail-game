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
END;
$$ LANGUAGE plpgsql;
