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
END;
$$ LANGUAGE plpgsql;
