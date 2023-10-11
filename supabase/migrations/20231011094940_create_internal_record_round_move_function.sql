-- This function records a move in a round.
CREATE OR REPLACE FUNCTION internal_record_round_move(p_game_round_id UUID, p_user_id UUID, p_move_type move_type, p_letter CHAR(1) DEFAULT NULL) 
RETURNS VOID AS $$
BEGIN
    INSERT INTO round_moves (game_round_id, user_id, type, letter)
    VALUES (p_game_round_id, p_user_id, p_move_type, p_letter);
END;
$$ LANGUAGE plpgsql;
