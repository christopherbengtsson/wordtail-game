-- ================================================
-- Function: get_game_stats_by_id
-- Description: 
--    Supposed to be called after a player made a move or when clicking an active game
--    where it's not the logged in users turn.
--
-- Parameters:
--    - p_game_id: UUID of the game whose statistics are to be fetched.
--    - p_user_id: UUID of the logged in user.
--
-- Returns: 
--    A table with details about the current player's turn, move type, letter used, word formed, game standings, and round details.
--
-- ================================================
CREATE OR REPLACE FUNCTION get_game_stats_by_id(p_game_id UUID, p_user_id UUID)
RETURNS TABLE(
  "currentPlayerId" UUID,
  "currentPlayerUsername" TEXT,
  "moveType" move_type,
  "letter" CHAR(1),
  "word" TEXT,
  "standings" JSONB[],
  "rounds" JSONB[]
) AS $$
WITH game_details AS (
    SELECT
        gr.current_player_id AS "currentPlayerId",
        p.username AS "currentPlayerUsername",
        rm.type AS "moveType",
        rm.letter,
        rm.word
    FROM game_rounds gr
    JOIN profiles p ON gr.current_player_id = p.id
    LEFT JOIN round_moves rm ON gr.id = rm.game_round_id
    WHERE gr.game_id = p_game_id
    ORDER BY rm.created_at DESC
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
),
moves AS (
    SELECT
        gr.round_number AS "roundNumber",
        jsonb_build_object(
            'playerId', rm.user_id,
            'username', (SELECT username FROM profiles WHERE id = rm.user_id),
            'moveType', rm.type,
            'createdAt', rm.created_at,
            'letter', rm.letter,
            'word', rm.word
        ) AS "moveData"
    FROM game_rounds gr
    JOIN round_moves rm ON gr.id = rm.game_round_id
    WHERE gr.game_id = p_game_id
),
round_moves AS (
    SELECT
        COALESCE(NULLIF(ARRAY_AGG("moveData" ORDER BY "moveData"->>'createdAt' DESC), ARRAY[NULL::jsonb]), ARRAY[]::jsonb[]) AS "roundsData"
    FROM moves
)
SELECT
    gd."currentPlayerId",
    gd."currentPlayerUsername",
    gd."moveType",
    gd.letter,
    gd.word,
    ps."standingsData" AS "standings",
    COALESCE(rm."roundsData", ARRAY[]::jsonb[]) AS "rounds"
FROM game_details gd 
CROSS JOIN player_standings ps 
CROSS JOIN round_moves rm;
$$
LANGUAGE SQL;
