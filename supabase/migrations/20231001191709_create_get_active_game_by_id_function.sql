CREATE OR REPLACE FUNCTION get_active_game_by_id(p_game_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "lettersSoFar" TEXT[],
    "lastMoveMade" move_type,
    "previousPlayerId" UUID,
    "previousPlayerUsername" TEXT,
    "maxNumberOfMarks" INT,
    "currentRoundNumber" INT
) AS $$
BEGIN
    RETURN QUERY
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
    -- Fetching detailed game data, including its current and previous moves.
    SELECT 
        g.id,
        g.name,
        COALESCE(MAX(rm.created_at), g.updated_at) as "updatedAt",
        p.id as "currentTurnProfileId",
        p.username as "currentTurnUsername",
        COALESCE(NULLIF(ARRAY_AGG(CASE WHEN rm.letter IS NOT NULL THEN rm.letter::text END ORDER BY rm.created_at), ARRAY[NULL::text]), ARRAY[]::text[]) AS "lettersSoFar",
        prev_move.type as "lastMoveMade",
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
