-- ================================================
-- Function: internal_start_new_round
-- Description: 
--    Concludes the existing round and initiates a new one for a particular game. 
--    The new round starts with the designated starting player and has a round number incremented by one from the previous round.
--
-- Parameters:
--    - p_game_id: The ID of the game for which the new round is being initiated.
--    - p_user_id: The ID of the user triggering the start of the new round.
--    - p_current_round_id: The ID of the round that's currently in progress.
--    - p_current_round_number: The number of the round that's currently in progress.
--    - p_starting_player_id: The ID of the player who should initiate the new round.
--
-- Returns: 
--    UUID - The ID of the newly initiated round.
--
-- Note: 
--    It's imperative to ensure that the prior round is concluded before initiating a new one using this function.
-- ================================================
CREATE OR REPLACE FUNCTION internal_start_new_round(p_game_id UUID, p_user_id UUID, p_current_round_id UUID, p_current_round_number INT, p_starting_player_id UUID) 
RETURNS UUID AS $$
DECLARE
    new_round_id UUID;
BEGIN
    -- Initiate a new round, incrementing its number by one from the prior round, and assign the designated starting player. Fetch the ID of this new round.
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, p_current_round_number + 1, 'active', p_starting_player_id)
    RETURNING id INTO new_round_id;

    -- Return the ID of the newly created round.
    RETURN new_round_id;
END;
$$ LANGUAGE plpgsql;
