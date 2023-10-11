-- This function checks if a player has reached the maximum number of marks in a game and updates the game status accordingly.
CREATE OR REPLACE FUNCTION internal_check_and_update_game_status(p_game_id UUID, p_user_id UUID, p_max_marks INTEGER) 
RETURNS BOOLEAN AS $$
DECLARE
    active_players_count INT;
BEGIN
    -- If the player has reached the max marks, set their status to 'out'
    IF p_max_marks = (SELECT max_number_of_marks FROM games WHERE id = p_game_id) THEN
        -- Update player status to 'out'
        UPDATE game_players 
        SET status = 'out'
        WHERE game_id = p_game_id AND user_id = p_user_id;

        -- Count the remaining active players
        SELECT COUNT(*) INTO active_players_count
        FROM game_players
        WHERE game_id = p_game_id AND status = 'active';

        -- If only one active player remains, set the game status to 'finished'
        IF active_players_count = 1 THEN
            -- Finish the game and set the winner
            UPDATE games
            SET status = 'finished', winner_id = (SELECT user_id FROM game_players WHERE game_id = p_game_id AND status = 'active'), updated_at = now()
            WHERE id = p_game_id;
            RETURN TRUE; -- Indicates that the game has finished
        END IF;
    END IF;
    
    RETURN FALSE; -- Indicates that the game is still ongoing
END;
$$ LANGUAGE plpgsql;
