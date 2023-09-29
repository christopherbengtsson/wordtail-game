CREATE OR REPLACE FUNCTION get_user_games(p_user_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    status game_status,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "winnerProfileId" UUID,
    "winnerUsername" TEXT,
    "lettersSoFar" TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,                            -- "id" UUID
        g.name,                          -- "name" TEXT
        g.status,                        -- status game_status
        MAX(rm.created_at),              -- "updatedAt" TIMESTAMP WITH TIME ZONE
        CASE                             -- "currentTurnProfileId" UUID
            WHEN g.status = 'active' THEN p.id
            ELSE NULL
        END,
        CASE                             -- "currentTurnUsername" TEXT
            WHEN g.status = 'active' THEN p.username
            ELSE NULL
        END,
        CASE                             -- "winnerProfileId" UUID
            WHEN g.status = 'finished' THEN pw.id
            ELSE NULL
        END,
        CASE                             -- "winnerUsername" TEXT
            WHEN g.status = 'finished' THEN pw.username
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'active' THEN ARRAY_AGG(rm.letter::text ORDER BY rm.created_at)
            ELSE NULL
        END
    FROM games g
    JOIN game_players gp ON g.id = gp.game_id
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    LEFT JOIN profiles pw ON pw.id = g.winner_id
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id AND rm.type = 'add_letter'
    WHERE gp.user_id = get_user_games.p_user_id
    GROUP BY g.id, g.name, g.status, p.id, p.username, pw.id, pw.username;
END;
$$ LANGUAGE plpgsql;
