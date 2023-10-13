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
END;
$$ LANGUAGE plpgsql;
