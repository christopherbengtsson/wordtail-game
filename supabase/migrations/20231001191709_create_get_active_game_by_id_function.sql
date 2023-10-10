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
    -- Fetching detailed game data, including its current and previous moves.
    SELECT 
        g.id,
        g.name,
        COALESCE(MAX(rm.created_at), g.updated_at) as "updatedAt",
        p.id as "currentTurnProfileId",
        p.username as "currentTurnUsername",
        COALESCE(NULLIF(ARRAY_AGG(CASE WHEN rm.letter IS NOT NULL THEN rm.letter::text END ORDER BY rm.created_at), ARRAY[NULL::text]), ARRAY[]::text[]) AS "lettersSoFar",
        last_move.type as "lastMoveMade",
        prev_move.user_id as "previousPlayerId",
        prev_profile.username as "previousPlayerUsername",
        g.max_number_of_marks as "maxNumberOfMarks",
        gr.round_number as "currentRoundNumber"
    FROM games g
    -- Joining relevant tables to fetch necessary data.
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id AND rm.type = 'add_letter'
    -- Fetching the most recent move and its type.
    LEFT JOIN LATERAL (SELECT type FROM round_moves WHERE game_round_id = gr.id ORDER BY created_at DESC LIMIT 1) AS last_move ON TRUE
    -- Fetching the previous move and its user.
    LEFT JOIN LATERAL (SELECT user_id FROM round_moves WHERE game_round_id = gr.id AND type != last_move.type LIMIT 1) AS prev_move ON TRUE
    LEFT JOIN profiles prev_profile ON prev_profile.id = prev_move.user_id
    WHERE g.id = p_game_id
    GROUP BY g.id, g.name, p.id, p.username, last_move.type, prev_move.user_id, prev_profile.username, g.max_number_of_marks, gr.round_number, g.updated_at;
END;
$$ LANGUAGE plpgsql;
