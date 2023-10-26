-- ================================================
-- Function: internal_get_adjacent_players_order
-- Description: 
--    Retrieves the adjacent (previous and next) players based on a specific order 
--    for a given round and user. If the specified user is the first or last player 
--    in the sequence, the function wraps around, ensuring continuity in the game order.
--
-- Parameters:
--    - p_round_id: The ID of the round.
--    - p_user_id: The ID of the user for whom we want to find adjacent players.
--
-- Returns: 
--    A table containing UUIDs for the previous and next players.
-- ================================================
CREATE OR REPLACE FUNCTION internal_get_adjacent_players_order(p_round_id UUID, p_user_id UUID) 
RETURNS TABLE (prev_id UUID, next_id UUID) AS $$
BEGIN
    RETURN QUERY
    -- Define a CTE to capture each player's adjacent peers.
    WITH player_order AS (
        SELECT 
            player_id, 
            order_of_play,
            -- Fetch the player immediately preceding the current one in order.
            LAG(player_id) OVER (ORDER BY order_of_play) AS lag_id, 
            -- Fetch the player immediately succeeding the current one in order.
            LEAD(player_id) OVER (ORDER BY order_of_play) AS lead_id 
        FROM round_player_order
        WHERE round_id = p_round_id
    )
    SELECT 
        -- Provide the last player as a fallback when there's no predecessor.
        COALESCE(lag_id, (SELECT player_id FROM player_order ORDER BY order_of_play DESC LIMIT 1)) AS prev_id,
        -- Provide the first player as a fallback when there's no successor.
        COALESCE(lead_id, (SELECT player_id FROM player_order ORDER BY order_of_play ASC LIMIT 1)) AS next_id
    FROM player_order
    WHERE player_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
