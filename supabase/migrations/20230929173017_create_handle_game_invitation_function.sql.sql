-- Accepting a game invitation
CREATE OR REPLACE FUNCTION accept_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    creator_id UUID;
    starting_player UUID;
    second_player UUID;
BEGIN
    -- Update the invitation status for the user
    UPDATE game_players 
    SET invitation_status = 'accepted' 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total players and the number of accepted invitations
    SELECT COUNT(*), COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Fetch the game creator's ID
    SELECT starter_id INTO creator_id FROM games WHERE id = p_game_id;

    -- Decide the starting player
    IF accepted_count = total_players THEN
        game_state := 'active';
        starting_player := p_user_id;
        second_player := creator_id;
    ELSE
        game_state := 'pending';
        RETURN game_state; -- Early return if the game is still pending
    END IF;

    -- Insert the first round into the game_rounds table
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, 1, 'active', starting_player)
    RETURNING id INTO round_id;

    -- Insert the players into round_player_order based on their play order
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    VALUES 
        (round_id, starting_player, 1),
        (round_id, second_player, 2);

    -- Random order for the rest of the players (excluding starting and second players)
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    SELECT round_id, user_id, row_number() OVER () + 2
    FROM game_players 
    WHERE game_id = p_game_id AND user_id NOT IN (starting_player, second_player)
    ORDER BY RANDOM();

    -- Update the game's status in the games table
    UPDATE games SET status = game_state WHERE id = p_game_id;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;

-- Declining a game invitation
CREATE OR REPLACE FUNCTION decline_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    creator_id UUID;
BEGIN
    -- Remove the user's association from the game
    DELETE FROM game_players 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total remaining players and the number of accepted invitations
    SELECT COUNT(*), COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Fetch the game creator's ID
    SELECT starter_id INTO creator_id FROM games WHERE id = p_game_id;

    -- Decide the game status
    IF accepted_count = total_players THEN
        game_state := CASE WHEN total_players = 1 THEN 'abandoned' ELSE 'active' END;
    ELSE
        game_state := 'pending';
        RETURN game_state; -- Early return if the game is still pending or abandoned
    END IF;

    -- Insert the first round into the game_rounds table
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, 1, 'active', creator_id)
    RETURNING id INTO round_id;

    -- Random order for the players (starting with the game creator)
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    SELECT round_id, user_id, row_number() OVER ()
    FROM game_players 
    WHERE game_id = p_game_id
    ORDER BY CASE WHEN user_id = creator_id THEN 0 ELSE 1 END, RANDOM();

    -- Update the game's status in the games table
    UPDATE games SET status = game_state WHERE id = p_game_id;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;
