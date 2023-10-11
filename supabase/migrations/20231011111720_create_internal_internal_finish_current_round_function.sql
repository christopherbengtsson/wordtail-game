-- This function finishes the current round, setting its status to 'finished' and updating the 
-- last moved user ID and timestamp.
-- 
-- Parameters:
-- p_current_round_id: The ID of the round to be finished.
-- p_user_id: The ID of the user who made the last move in this round.
CREATE OR REPLACE FUNCTION internal_finish_current_round(p_current_round_id UUID, p_user_id UUID) 
RETURNS VOID AS $$
BEGIN
    -- Finish the current round
    UPDATE game_rounds
    SET status = 'finished', 
        last_moved_user_id = p_user_id, 
        current_player_id = NULL, 
        updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_current_round_id;
END;
$$ LANGUAGE plpgsql;
