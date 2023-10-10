-- Define a custom function to retrieve games associated with a user
CREATE OR REPLACE FUNCTION get_user_games(p_user_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    status game_status,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "creatorProfileId" UUID,
    "creatorUsername" TEXT,
    "currentTurnProfileId" UUID,
    "currentTurnUsername" TEXT,
    "winnerProfileId" UUID,
    "winnerUsername" TEXT,
    "waitingForUsers" UUID[]
) AS $$
BEGIN

    -- Return a structured query
    RETURN QUERY
    
    -- Select relevant fields from the associated tables
    SELECT 
        g.id,
        g.name,
        g.status,
        g.created_at,  -- Game creation timestamp
        MAX(rm.created_at),
        ps.id,         -- ID of the profile who started the game
        ps.username,   -- Username of the profile who started the game
        CASE
            WHEN g.status = 'active' THEN p.id
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'active' THEN p.username
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'finished' THEN pw.id
            ELSE NULL
        END,
        CASE
            WHEN g.status = 'finished' THEN pw.username
            ELSE NULL
        END,
        CASE 
            -- If game is pending, identify users yet to accept the game invitation
            WHEN g.status = 'pending' THEN ARRAY(SELECT user_id FROM game_players WHERE game_id = g.id AND invitation_status = 'pending')
            ELSE NULL
        END

    -- Use the games table as the primary source
    FROM games g
    
    -- Join the game_players table to filter games associated with the user
    JOIN game_players gp ON g.id = gp.game_id
    
    -- Optionally join with the game_rounds table for active rounds
    LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
    
    -- Join with profiles table to fetch details of the current player
    LEFT JOIN profiles p ON p.id = gr.current_player_id
    
    -- Join with profiles table to fetch details of the game's winner
    LEFT JOIN profiles pw ON pw.id = g.winner_id
    
    -- Join with profiles table to fetch details of the game's starter
    LEFT JOIN profiles ps ON ps.id = g.creator_id
    
    -- Optionally join with round_moves table to get the last update time
    LEFT JOIN round_moves rm ON rm.game_round_id = gr.id
    
    -- Filter results for the specific user passed to the function
    WHERE gp.user_id = get_user_games.p_user_id
    
    -- Group to structure the results as needed
    GROUP BY g.id, g.name, g.status, g.created_at, p.id, p.username, pw.id, pw.username, ps.id, ps.username;

END;

-- Set the language for the function as PL/pgSQL
$$ LANGUAGE plpgsql;
