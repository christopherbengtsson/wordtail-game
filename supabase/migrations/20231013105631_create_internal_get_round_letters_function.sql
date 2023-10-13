-- ================================================
-- Function: internal_get_round_letters
-- Description: 
--    Internal function to fetch the concatenated letters for a given game round, 
--    based on the `round_moves` table.
--
-- Parameters:
--    - p_game_round_id: The ID of the game round.
--
-- Returns: 
--    A TEXT containing the concatenated string of letters for the given game round.
--
-- Notes: 
--    - Only letters with type 'add_letter' are considered.
-- ================================================
CREATE OR REPLACE FUNCTION internal_get_round_letters(
    p_game_round_id UUID
) 
RETURNS TEXT AS $$
DECLARE
    round_letters TEXT;  -- To hold the concatenated string of letters.
BEGIN
    SELECT string_agg(letter, '' ORDER BY created_at) INTO round_letters
    FROM round_moves
    WHERE game_round_id = p_game_round_id AND type = 'add_letter';

    RETURN round_letters;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in "internal_get_round_letters": %', SQLERRM;

END;
$$ LANGUAGE plpgsql;
