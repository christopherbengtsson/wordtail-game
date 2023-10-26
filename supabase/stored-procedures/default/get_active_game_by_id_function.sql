-- ================================================
-- Function: get_active_game_by_id
-- Description: 
--    Fetches detailed information about an active game by its ID. 
--    This includes the current turn's player, letters used so far in the round, previous move's type, 
--    and its player, the maximum number of marks for the game, and the current round number.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--
-- Returns: 
--    A table containing details of the active game such as name, update time, current turn's player information,
--    letters used so far in the round, the previous move's type, its player, the maximum number of marks for the game, 
--    and the current round number.
--
-- Usage Example:
--    To get the details for a game with ID 'some_game_id':
--    SELECT * FROM get_active_game_by_id('some_game_id');
--
-- Notes: 
--    - Ensure that the provided game ID is valid. This function does not handle invalid game IDs or provide error messages for them.
--    - The function assumes the existence of the required tables and relationships among them.
--    - The function aggregates letters in a round, and if there are no letters, it returns an empty array.
--    - The previous move's player and its type are determined from the most recent entry in the round_moves table.
-- ================================================
CREATE OR REPLACE FUNCTION get_active_game_by_id(p_game_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "lettersSoFar" TEXT[],
    "previousMoveType" move_type,
    "previousPlayerId" UUID,
    "previousPlayerUsername" TEXT,
    "maxNumberOfMarks" INT,
    "currentRoundNumber" INT
) AS $$
BEGIN
    RETURN QUERY
    -- get previous move as CTE
    WITH prev_move_cte AS (
         SELECT 
             rm.game_round_id, 
             rm.type,
             rm.user_id 
         FROM round_moves rm
         WHERE rm.game_round_id IN (SELECT gr.id FROM game_rounds gr WHERE gr.game_id = p_game_id AND gr.status = 'active')
         ORDER BY rm.created_at DESC 
         LIMIT 1
    )
    -- Fetching detailed game data, including previous move.
    SELECT 
        g.id,
        g.name,
        COALESCE(MAX(rm.created_at), g.updated_at) as "updatedAt", -- fallback to game's updated_at if first round move
        p.id as "currentTurnProfileId",
        p.username as "currentTurnUsername",
        COALESCE(NULLIF(ARRAY_AGG(CASE WHEN rm.letter IS NOT NULL THEN rm.letter::text END ORDER BY rm.created_at), ARRAY[NULL::text]), ARRAY[]::text[]) AS "lettersSoFar", -- fallback to empty array if no letters
        prev_move.type as "previousMoveType",
        prev_move.user_id as "previousPlayerId",
        prev_profile.username as "previousPlayerUsername",
        g.max_number_of_marks as "maxNumberOfMarks",
        gr.round_number as "currentRoundNumber"
    FROM games g
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id
    LEFT JOIN prev_move_cte prev_move ON prev_move.game_round_id = gr.id
    LEFT JOIN profiles prev_profile ON prev_profile.id = prev_move.user_id
    WHERE g.id = p_game_id
    GROUP BY g.id, g.name, p.id, p.username, prev_move.type, prev_move.user_id, prev_profile.username, g.max_number_of_marks, gr.round_number, g.updated_at;
END;
$$ LANGUAGE plpgsql;
