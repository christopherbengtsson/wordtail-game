-- ================================================
-- Function: get_base_game_stats_by_id
-- Description: 
--    Retrieves basic game statistics for a given game ID. 
--    The details fetched include the current player's information and the standings of all players.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--    - p_user_id: The ID of the logged in user.
--
-- Returns: 
--    A table containing details of the current player's ID and username,
--    as well as an aggregated list of player standings in the game.
--
-- Usage Example:
--    To get the basic statistics for a game with ID 'some_game_id':
--    SELECT * FROM get_base_game_stats_by_id('some_game_id', 'some_user_id');
--
-- Notes: 
--    - The standings for players are aggregated as a JSONB array for easier handling and interpretation.
-- ================================================
CREATE OR REPLACE FUNCTION get_base_game_stats_by_id(p_game_id UUID, p_user_id UUID)
RETURNS TABLE(
  "currentPlayerId" UUID,
  "currentPlayerUsername" TEXT,
  "gameStatus" game_status,
  "standings" JSONB[]
) AS $$
BEGIN
    RETURN QUERY 
    WITH game_details AS (
        SELECT
            gr.current_player_id AS "currentPlayerId",
            COALESCE(p.username, 'N/A') AS "currentPlayerUsername",
            g.status AS "gameStatus"
        FROM game_rounds gr
        LEFT JOIN profiles p ON gr.current_player_id = p.id
        JOIN games g ON gr.game_id = g.id
        WHERE gr.game_id = p_game_id
        LIMIT 1
    ),
    player_standings AS (
        SELECT
            ARRAY_AGG(
                jsonb_build_object(
                    'playerId', gp.user_id,
                    'username', p.username,
                    'marks', gp.marks
                )
            ) AS "standingsData"
        FROM game_players gp
        JOIN profiles p ON gp.user_id = p.id
        WHERE gp.game_id = p_game_id
    )
    SELECT
        gd."currentPlayerId",
        gd."currentPlayerUsername",
        gd."gameStatus",
        ps."standingsData" AS "standings"
    FROM game_details gd 
    CROSS JOIN player_standings ps;
END;
$$
LANGUAGE plpgsql;
