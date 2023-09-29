-- Accepting a game invitation
CREATE OR REPLACE FUNCTION accept_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
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

    -- Decide the game status based on the number of acceptances
    IF accepted_count = total_players THEN
        game_state := 'active';
    ELSE
        game_state := 'pending';
    END IF;

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
    declined_count INT;
    game_state game_status;
BEGIN
    -- Update the invitation status for the user
    UPDATE game_players 
    SET invitation_status = 'declined' 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total players, the number of accepted and declined invitations
    SELECT COUNT(*), 
           COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END),
           COUNT(CASE WHEN invitation_status = 'declined' THEN 1 END)
    INTO total_players, accepted_count, declined_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Decide the game status based on the number of acceptances and rejections
    IF accepted_count + declined_count = total_players THEN
        IF accepted_count = 1 THEN
            game_state := 'abandoned';
        ELSE
            game_state := 'active';
        END IF;
    ELSE
        game_state := 'pending';
    END IF;

    -- Update the game's status in the games table
    UPDATE games SET status = game_state WHERE id = p_game_id;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;
