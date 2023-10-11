-- This function increments the marks for a given player in a specific game and returns the updated marks.
CREATE OR REPLACE FUNCTION internal_increment_and_get_player_marks(p_game_id UUID, p_user_id UUID) 
RETURNS INTEGER AS $$
DECLARE
    updated_marks INTEGER;
BEGIN
    -- Update the marks for the player
    UPDATE game_players 
    SET marks = marks + 1
    WHERE game_id = p_game_id AND user_id = p_user_id
    RETURNING marks INTO updated_marks;
    
    -- Return the updated marks
    RETURN updated_marks;
END;
$$ LANGUAGE plpgsql;
