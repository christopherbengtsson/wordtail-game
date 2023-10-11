-- This function finishes the current round and starts a new one, returning the ID of the new round.
CREATE OR REPLACE FUNCTION internal_finish_and_start_new_round(p_game_id UUID, p_user_id UUID, p_current_round_id UUID, p_current_round_number INT, p_starting_player_id UUID) 
RETURNS UUID AS $$
DECLARE
    new_round_id UUID;
BEGIN
    -- Finish the current round
    UPDATE game_rounds
    SET status = 'finished', last_moved_user_id = p_user_id, current_player_id = NULL, updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_current_round_id;

    -- Start a new round and fetch its ID
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, p_current_round_number + 1, 'active', p_starting_player_id)
    RETURNING id INTO new_round_id;

    RETURN new_round_id;
END;
$$ LANGUAGE plpgsql;
