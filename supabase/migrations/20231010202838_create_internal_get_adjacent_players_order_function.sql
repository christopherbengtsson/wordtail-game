-- This function fetches the next and previous player in order for a given round and user.
-- It uses the LAG and LEAD window functions to determine the players adjacent to the specified user in the player order.
-- If there is no previous or next player (i.e., the user is the first or last in the order),
-- it wraps around and provides the last or first player respectively.
CREATE OR REPLACE FUNCTION internal_get_adjacent_players_order(p_round_id UUID, p_user_id UUID) 
RETURNS TABLE (prev_id UUID, next_id UUID) AS $$
BEGIN
    RETURN QUERY
    -- CTE to get the order of players with their previous and next players.
    WITH player_order AS (
        SELECT 
            player_id, 
            order_of_play,
            LAG(player_id) OVER (ORDER BY order_of_play) AS lag_id, -- Get the previous player
            LEAD(player_id) OVER (ORDER BY order_of_play) AS lead_id -- Get the next player
        FROM round_player_order
        WHERE round_id = p_round_id
    )
    SELECT 
        -- If there's no previous player, fetch the last player in order. Otherwise, fetch the previous player.
        COALESCE(lag_id, (SELECT player_id FROM player_order ORDER BY order_of_play DESC LIMIT 1)) AS prev_id,
        -- If there's no next player, fetch the first player in order. Otherwise, fetch the next player.
        COALESCE(lead_id, (SELECT player_id FROM player_order ORDER BY order_of_play ASC LIMIT 1)) AS next_id
    FROM player_order
    WHERE player_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
