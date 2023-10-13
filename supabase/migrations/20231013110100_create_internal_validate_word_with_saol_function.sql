-- ================================================
-- Function: internal_validate_word_with_saol
-- Description: 
--    Validates if a given word is valid by making a request to SAOL
--    and checking the response. The result is then used to determine which player
--    is affected by the validation outcome.
--
-- Parameters:
--    - p_api_url: The base URL endpoint of the external API.
--    - word: The word to validate.
--    - p_user_id: The ID of the current player.
--    - next_player_id: The ID of the next player.
--
-- Returns: 
--    BOOLEAN indicating if the word is valid or not.
--    TRUE: Word is valid.
--    FALSE: Word is not valid.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_validate_word_with_saol(
    p_api_url TEXT,
    word TEXT
) 
RETURNS BOOLEAN AS $$
DECLARE
    api_result RECORD;          -- To hold the response from the API call.
    valid_word BOOLEAN;         -- Flag to determine if the word is valid or not.
BEGIN
    -- Fetch word validation from SAOL
    api_result := internal_perform_http_get_from_server(format('%s%s', p_api_url, word));

    -- Check if word is valid based on the response
    IF api_result.data LIKE format('%%Sökningen på <strong>%s</strong> i SAOL gav inga svar%%', word) THEN
        valid_word := FALSE;
    ELSE
        valid_word := TRUE;
    END IF;

    RETURN valid_word;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in "internal_validate_word": %', SQLERRM;

END;
$$ LANGUAGE plpgsql;
