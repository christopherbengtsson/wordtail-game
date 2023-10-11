-- ================================================
-- Function: internal_increment_and_get_player_marks
-- Description: 
--    Increments the marks/points for a specified player within a given game.
--    After updating the score, the function then returns the new marks total.
--
-- Parameters:
--    - p_game_id: The ID of the game where the player's marks need to be updated.
--    - p_user_id: The ID of the player whose marks are to be incremented.
--
-- Returns: 
--    INTEGER - The updated marks of the player after the increment.
--
-- Note: 
--    The function performs an atomic update-then-fetch operation, ensuring accurate mark retrieval.
-- ================================================
CREATE OR REPLACE FUNCTION internal_increment_and_get_player_marks(p_game_id UUID, p_user_id UUID) 
RETURNS INTEGER AS $$
DECLARE
    updated_marks INTEGER;
BEGIN
    -- Increment the player's marks for the specified game.
    UPDATE game_players 
    SET marks = marks + 1
    WHERE game_id = p_game_id AND user_id = p_user_id
    RETURNING marks INTO updated_marks;
    
    -- Return the newly updated marks value.
    RETURN updated_marks;
END;
$$ LANGUAGE plpgsql;
