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
