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
  "standings" JSONB[]
) AS $$
-- Fetch the current player details for the given game
WITH game_details AS (
    SELECT
        gr.current_player_id AS "currentPlayerId",
        p.username AS "currentPlayerUsername"
    FROM game_rounds gr
    JOIN profiles p ON gr.current_player_id = p.id
    WHERE gr.game_id = p_game_id
    LIMIT 1
),
-- Fetch the standings of all players in the game
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
-- Return the current player details and game standings
SELECT
    gd."currentPlayerId",
    gd."currentPlayerUsername",
    ps."standingsData" AS "standings"
FROM game_details gd 
CROSS JOIN player_standings ps;
$$
LANGUAGE SQL;
