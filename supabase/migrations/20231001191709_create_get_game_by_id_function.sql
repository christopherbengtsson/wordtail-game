CREATE OR REPLACE FUNCTION get_game_by_id(p_game_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    status game_status,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "winnerProfileId" UUID,
    "winnerUsername" TEXT,
    "lettersSoFar" TEXT[],
    "lastMoveMade" move_type,
    "previousPlayerId" UUID,
    "previousPlayerUsername" TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Begin the main query to fetch the game details
    SELECT 
        g.id,
        g.name,
        g.status,
        MAX(rm.created_at),
        -- Check if the game is active to decide the current turn details
        CASE
            WHEN g.status = 'active' THEN p.id
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'active' THEN p.username
            ELSE NULL
        END,
        -- Check if the game is finished to decide the winner details
        CASE
            WHEN g.status = 'finished' THEN pw.id
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'finished' THEN pw.username
            ELSE NULL
        END,
        -- Aggregate letters added in the current round, excluding NULLs
        COALESCE(NULLIF(ARRAY_AGG(CASE WHEN rm.letter IS NOT NULL THEN rm.letter::text END ORDER BY rm.created_at), ARRAY[NULL::text]), ARRAY[]::text[]) AS "lettersSoFar",
        -- Using LATERAL to fetch the most recent move
        last_move.type,
        -- Using LATERAL to fetch the move before the most recent move
        prev_move.user_id,
        -- Get the username of the player who made the previous move
        prev_profile.username
    FROM games g
    -- Join tables to fetch relevant game details
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    LEFT JOIN profiles pw ON pw.id = g.winner_id
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id AND rm.type = 'add_letter'
    -- Use LATERAL join to fetch the type of the most recent move
    LEFT JOIN LATERAL (SELECT type FROM round_moves WHERE game_round_id = gr.id ORDER BY created_at DESC LIMIT 1) AS last_move ON TRUE
    -- Use LATERAL join to fetch the user_id of the move before the most recent move
    LEFT JOIN LATERAL (SELECT user_id FROM round_moves WHERE game_round_id = gr.id AND type != last_move.type LIMIT 1) AS prev_move ON TRUE
    -- Fetch the username of the player who made the previous move
    LEFT JOIN profiles prev_profile ON prev_profile.id = prev_move.user_id
    WHERE g.id = p_game_id
    GROUP BY g.id, g.name, g.status, p.id, p.username, pw.id, pw.username, last_move.type, prev_move.user_id, prev_profile.username;
END;
$$ LANGUAGE plpgsql;
