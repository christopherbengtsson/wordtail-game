-- Basic idea:
-- user gives up:
--     mark user
--     finish game or start new round with previous user
-- 
-- user submits word;
--     validate word
--     word is valid:
--         mark previous user
--         finish game or start new round with current user
--     word is not valid:
--         mark current user
--         finish game or start new round with previous user
-- ================================================
-- Function: reveal_bluff_move
-- Description: 
--    Handles a player's 'reveal_bluff' move. This can be executed when previous user has called out current player for bluffing.
--
-- Parameters:
--    - p_game_id: The ID of the game where the move is made.
--    - p_user_id: The ID of the player making the move.
--    - p_api_url: API url to SAOL
--    - p_word: The word the user was thinking about, placing their last letter
--
-- Returns: 
--    VOID - This function doesn't return any value; its main purpose is to handle and update the game's state based on player actions.
--
-- ================================================
CREATE OR REPLACE FUNCTION reveal_bluff_move(p_game_id UUID, p_user_id UUID, p_saol_base_api_url TEXT, p_word TEXT)
RETURNS VOID AS $$
DECLARE
    prev_player_id UUID;          -- ID of the previous player in the game
    next_player_id UUID;          -- ID of the next player in the game
    starting_player_id UUID;      -- ID of of the player that should start next round
    current_max_marks INT;        -- Current maximum marks a player has
    current_round_id UUID;        -- ID of the active round
    current_round_number INT;     -- Number of the active round
    new_round_id UUID;            -- ID of the new round (if created)
    affected_player_id UUID;      -- Player ID who will be affected based on word validity
    round_letters TEXT;           -- Concatenated letters from the active round to form the word
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
    round_letters := internal_get_round_letters(current_round_id);
    -- Check that submitted word starts with letters in round
    IF LEFT(p_word, LENGTH(round_letters)) = round_letters THEN
        -- Validate word with SAOL
        IF internal_validate_word_with_saol(p_saol_base_api_url, p_word) THEN
            -- Valid word ✅
            -- Next player will get a mark
            -- Current player should start new round
            affected_player_id := next_player_id;
            starting_player_id := p_user_id;
        ELSE
            -- Not a valid word ❌
            -- Current player will get a mark
            -- Next player (player that called bluff) should start new round
            affected_player_id := p_user_id;
            starting_player_id := next_player_id;
        END IF;
    ELSE
        -- Not a valid word ❌
        -- Current player will get a mark
        -- Next player (player that called bluff) should start new round
        affected_player_id := p_user_id;
        starting_player_id := next_player_id;
    END IF;

    -- Common operations based on affected player:

    -- Record the reveal_bluff move
    PERFORM internal_record_round_move(current_round_id, p_user_id, 'reveal_bluff', p_word);
    -- Update the marks for the affected player
    current_max_marks := internal_increment_and_get_player_marks(p_game_id, affected_player_id);
        -- Check the game's status and make necessary updates
    IF internal_check_and_update_game_status_by_marks(p_game_id, affected_player_id, current_max_marks) THEN
        -- Game is finished, no new rounds initiated
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
    ELSE
        -- Finish the current round
        PERFORM internal_finish_current_round(current_round_id, p_user_id);
        -- Start a new round, fetching the ID of the new round
        new_round_id := internal_start_new_round(p_game_id, p_user_id, current_round_id, current_round_number, starting_player_id);
        -- Set player order for the new round
        PERFORM internal_set_new_player_round_order(new_round_id, starting_player_id, current_round_id);
    END IF;
END;
$$ LANGUAGE plpgsql;
