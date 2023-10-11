-- ================================================
-- Function: validate_completed_word
-- Description: 
--    Validates a completed word using an external API to determine its validity. 
--    Marks the current or previous player based on the word's validity.
--
-- Parameters:
--    - p_game_id: The ID of the game in which the word needs validation.
--    - p_api_url: The URL endpoint of the external API to call for word validation.
--    - p_user_id: The ID of the current player.
--
-- Returns: 
--    JSONB object containing the SAOL response and an error message (if any).
--
-- Notes: 
--    - This function uses the `internal_perform_http_get_from_server` function.
-- ================================================
CREATE OR REPLACE FUNCTION validate_completed_word(
    p_game_id UUID,
    p_api_url TEXT,
    p_user_id UUID
) 
RETURNS JSONB AS $$
DECLARE
    round_letters TEXT;           -- Concatenated letters from the active round to form the word
    api_result RECORD;            -- Holds the response received from the external API
    response_text TEXT;           -- Extracted text content from the API's response
    error_message TEXT;           -- Holds error messages if encountered during the process
    prev_player_id UUID;          -- ID of the previous player in the game
    next_player_id UUID;          -- ID of the next player in the game
    current_max_marks INT;        -- Current maximum marks a player has
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
    new_round_id UUID;            -- ID of the new round (if created)
    affected_player_id UUID;      -- Player ID who will be affected (either get a mark or not) based on word validity
BEGIN
    -- Fetch Current Round Information
    WITH current_round AS (
        SELECT id, round_number
        FROM game_rounds 
        WHERE game_id = p_game_id
        ORDER BY created_at DESC LIMIT 1
    )
    SELECT id, round_number INTO current_round_id, current_round_number FROM current_round;

    -- Fetch the next and previous player's order
    SELECT prev_id, next_id INTO prev_player_id, next_player_id
    FROM internal_get_adjacent_players_order(current_round_id, p_user_id);

    -- Get all letters for the active round.
    SELECT string_agg(letter, '' ORDER BY created_at) INTO round_letters
    FROM round_moves
    WHERE game_round_id = current_round_id AND type = 'add_letter';


    -- Execute the internal function to get the API's response.
    api_result := internal_perform_http_get_from_server(format('%s%s', p_api_url, round_letters), 'text');

    -- If error, return early
    IF api_result.status = 'error' THEN
        error_message := api_result.message;
        RETURN jsonb_build_object('saol', NULL, 'error', error_message);
    END IF;

    response_text := api_result.data;

    -- Record 'call_finished_word' move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'call_finished_word');

    IF response_text LIKE format('%%Sökningen på <strong>%s</strong> i SAOL gav inga svar%%', round_letters) THEN
        -- It was NOT a word. Current player will get a mark
        affected_player_id := p_user_id;
    ELSE
        -- It was a word. Previous player will get a mark
        affected_player_id := prev_player_id;
    END IF;
    
    -- Common operations based on affected player:

    -- Update the marks for the affected player
    current_max_marks := internal_increment_and_get_player_marks(p_game_id, affected_player_id);
    -- Check the game's status and make necessary updates
    IF internal_check_and_update_game_status_by_marks(p_game_id, affected_player_id, current_max_marks) THEN
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
        -- Game has finished, so exit early
        RETURN jsonb_build_object('saol', response_text, 'error', error_message);
        -- TODO: Handle game archiving, new function or trigger?
    END IF;

    -- Finish the current round
    PERFORM internal_finish_current_round(current_round_id, p_user_id);
    -- Start a new round, fetching the ID of the new round
    new_round_id := internal_start_new_round(p_game_id, affected_player_id, current_round_id, current_round_number, p_user_id);
    -- Set player order for the new round
    PERFORM internal_set_new_player_round_order(new_round_id, affected_player_id, current_round_id);

    -- Return the result.
    RETURN jsonb_build_object('saol', response_text, 'error', error_message);

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('saol', NULL, 'error', format('Error processing: %s', SQLERRM));
END;
$$ LANGUAGE plpgsql;
