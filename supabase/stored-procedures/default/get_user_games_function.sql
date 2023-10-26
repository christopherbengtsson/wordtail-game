-- ================================================
-- Function: get_user_games
-- Description: 
--    Retrieves games associated with a specific user along with detailed information about each game.
--
-- Parameters:
--    - p_user_id: UUID of the user whose games are to be retrieved.
--
-- Returns: 
--    A table with detailed information about each game associated with the user.
--
-- Notes: 
--    - This function assumes the existence of the required tables (games, game_players, game_rounds, profiles, round_moves).
--    - The function returns details like game ID, name, status, timestamps, creator details, current turn player details, winner details, and a list of users yet to accept a pending game.
-- ================================================
CREATE OR REPLACE FUNCTION get_user_games(p_user_id UUID)
RETURNS TABLE (
    "id" UUID,
    "name" TEXT,
    status game_status,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    "playerStatus" player_status,
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

    -- Define a CTE for details of active games, including the current player and player status.
    WITH ActiveGames AS (
        SELECT 
            g.id,
            g.name,
            g.created_at,
            COALESCE(MAX(rm.created_at), g.updated_at) AS updated_at, -- Take the latest move time, or if none, game's update time.
            p.id AS current_turn_profile_id,
            p.username AS current_turn_username,
            gp.status
        FROM games g
        JOIN game_players gp ON g.id = gp.game_id
        LEFT JOIN game_rounds gr ON gr.game_id = g.id AND gr.status = 'active'
        LEFT JOIN profiles p ON p.id = gr.current_player_id
        LEFT JOIN round_moves rm ON rm.game_round_id = gr.id
        WHERE g.status = 'active' AND gp.user_id = p_user_id
        GROUP BY g.id, g.name, g.created_at, p.id, p.username, gp.status
    ),
    
    -- Define a CTE for creator details.
    CreatorDetails AS (
        SELECT g.id, ps.id AS creator_profile_id, ps.username AS creator_username
        FROM games g
        JOIN profiles ps ON ps.id = g.creator_id
    ),
    
    -- Define a CTE for details of the game's winner.
    WinnerDetails AS (
        SELECT g.id, pw.id AS winner_profile_id, pw.username AS winner_username
        FROM games g
        LEFT JOIN profiles pw ON pw.id = g.winner_id
    ),
    
    -- Define a CTE for list of users yet to accept a pending game.
    PendingInvitations AS (
        SELECT g.id, ARRAY(SELECT user_id FROM game_players WHERE game_id = g.id AND invitation_status = 'pending') AS waiting_for_users
        FROM games g
        WHERE g.status = 'pending'
    )

    -- Combine data from all the CTEs to produce the final result set.
    SELECT 
        g.id,
        g.name,
        g.status,
        g.created_at,
        COALESCE(ActiveGames.updated_at, g.updated_at),
        ActiveGames.status,
        CreatorDetails.creator_profile_id,
        CreatorDetails.creator_username,
        ActiveGames.current_turn_profile_id,
        ActiveGames.current_turn_username,
        WinnerDetails.winner_profile_id,
        WinnerDetails.winner_username,
        PendingInvitations.waiting_for_users

    FROM games g
    LEFT JOIN ActiveGames ON g.id = ActiveGames.id
    LEFT JOIN CreatorDetails ON g.id = CreatorDetails.id
    LEFT JOIN WinnerDetails ON g.id = WinnerDetails.id
    LEFT JOIN PendingInvitations ON g.id = PendingInvitations.id
    WHERE EXISTS (SELECT 1 FROM game_players WHERE game_id = g.id AND user_id = p_user_id); -- Ensure user is part of the game.
END;
$$ LANGUAGE plpgsql;
