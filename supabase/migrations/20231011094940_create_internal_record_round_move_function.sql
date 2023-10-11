-- ================================================
-- Function: internal_record_round_move
-- Description: 
--    Records a move made by a player during a specific round of the game.
--    A move consists of the type of move ('add_letter', 'give_up', etc.) and potentially a letter if it's an 'add_letter' move.
--
-- Parameters:
--    - p_game_round_id: The ID of the round in which the move is being made.
--    - p_user_id: The ID of the user/player making the move.
--    - p_move_type: Specifies the type of the move ('add_letter', 'give_up', etc.).
--    - p_letter (optional): The letter being added if the move type is 'add_letter'.
--
-- Returns: 
--    VOID - This function does not return any value; its purpose is to insert a record into the 'round_moves' table.
--
-- Note: 
--    Ensure that the move type and any associated data (like the letter) are valid before calling this function.
-- ================================================
CREATE OR REPLACE FUNCTION internal_record_round_move(p_game_round_id UUID, p_user_id UUID, p_move_type move_type, p_letter CHAR(1) DEFAULT NULL) 
RETURNS VOID AS $$
BEGIN
    -- Insert the details of the move made by the player into the 'round_moves' table.
    INSERT INTO round_moves (game_round_id, user_id, type, letter)
    VALUES (p_game_round_id, p_user_id, p_move_type, p_letter);
END;
$$ LANGUAGE plpgsql;
