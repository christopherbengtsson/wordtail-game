-- ================================================
-- Function: get_game_stats_by_id
-- Description: 
--    Fetches comprehensive game statistics for a particular game ID. 
--    The function provides detailed insights including the current turn's player, most recent move details, 
--    game standings, and a history of moves.
--
-- Parameters:
--    - p_game_id: The ID of the game to fetch details for.
--    - p_user_id: The ID of the logged in user.
--
-- Returns: 
--    A table with details about the current player's turn, move type, letter used, word formed, game standings, 
--    and a chronological list of round moves.
--
-- Usage Example:
--    To get comprehensive game stats for a game with ID 'some_game_id':
--    SELECT * FROM get_game_stats_by_id('some_game_id', 'some_user_id');
--
-- Notes:
--    - For move details, the function returns the most recent move. For round details, a historical list of moves is provided.
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
BEGIN
    RETURN QUERY 
    WITH base_info AS (
        SELECT * FROM get_base_game_stats_by_id(p_game_id, p_user_id)
    ),
    move_details AS (
        SELECT 
            rm.type AS "moveType",
            rm.letter,
            rm.word
        FROM round_moves rm 
        JOIN game_rounds gr ON gr.id = rm.game_round_id
        WHERE gr.game_id = p_game_id
        ORDER BY rm.created_at DESC
        LIMIT 1
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
    aggregated_moves AS (
        SELECT 
            "roundNumber",
            ARRAY_AGG("moveData" ORDER BY "moveData"->>'createdAt' DESC) AS moves
        FROM moves
        GROUP BY "roundNumber"
    )
    SELECT
        bi."currentPlayerId",
        bi."currentPlayerUsername",
        md."moveType",
        md.letter,
        md.word,
        bi."standings",
        ARRAY(
            SELECT jsonb_build_object('roundNumber', am."roundNumber", 'moves', am.moves)
            FROM aggregated_moves am
            ORDER BY am."roundNumber" DESC
        ) AS "rounds"
    FROM base_info bi
    CROSS JOIN move_details md;
END;
$$
LANGUAGE plpgsql;
