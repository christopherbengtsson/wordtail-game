-- ================================================
-- Function: internal_check_and_update_game_status_by_marks
-- Description: 
--    Evaluates if a player has achieved the maximum allowed marks in a game.
--    If so, it updates the player's status to 'out' and checks the game's overall status.
--    If only one player remains active, the game is marked as 'finished' and that player is set as the winner.
--
-- Parameters:
--    - p_game_id: The ID of the game to check and potentially update.
--    - p_user_id: The ID of the player whose marks are being evaluated.
--    - p_max_marks: The number of marks the player has currently achieved.
--
-- Returns: 
--    BOOLEAN - TRUE if the game has been finished, otherwise FALSE.
--
-- Note: 
--    This function plays a crucial role in progressing and potentially concluding a game based on player performance.
-- ================================================
CREATE OR REPLACE FUNCTION internal_check_and_update_game_status_by_marks(p_game_id UUID, p_user_id UUID, p_max_marks INTEGER) 
RETURNS BOOLEAN AS $$
DECLARE
    active_players_count INT;
BEGIN
    -- Determine if the player has achieved the maximum permissible marks.
    IF p_max_marks = (SELECT max_number_of_marks FROM games WHERE id = p_game_id) THEN
        -- Transition the player's status to 'out' since they've hit the mark cap.
        UPDATE game_players 
        SET status = 'out'
        WHERE game_id = p_game_id AND user_id = p_user_id;

        -- Quantify the number of players still in the 'active' state.
        SELECT COUNT(*) INTO active_players_count
        FROM game_players
        WHERE game_id = p_game_id AND status = 'active';

        -- If only a single active player persists, the game is deemed as 'finished'.
        IF active_players_count = 1 THEN
            -- Update the game's status and pinpoint the victor.
            UPDATE games
            SET status = 'finished', 
                winner_id = (SELECT user_id FROM game_players WHERE game_id = p_game_id AND status = 'active'), 
                updated_at = now()
            WHERE id = p_game_id;
            
            RETURN TRUE; -- Signifies the conclusion of the game.
        END IF;
    END IF;

    -- If not already returned, it means the game persists.
    RETURN FALSE; 
END;
$$ LANGUAGE plpgsql;
