-- Accepting a game invitation
CREATE OR REPLACE FUNCTION accept_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    creator_id UUID;
    remaining_players UUID[];
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

        -- Fetch the game creator's ID
        SELECT starter_id INTO creator_id FROM games WHERE id = p_game_id;

        -- Insert the first round into the game_rounds table and get its ID
        INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
        VALUES (p_game_id, 1, 'active', creator_id)
        RETURNING id INTO round_id;

        -- Insert the game creator as the first player in round_player_order
        INSERT INTO round_player_order (round_id, player_id, order_of_play)
        VALUES (round_id, creator_id, 1);

        -- Get a random order of the remaining players for the round
        SELECT ARRAY_AGG(user_id ORDER BY RANDOM())
        INTO remaining_players
        FROM game_players 
        WHERE game_id = p_game_id AND user_id != creator_id;

        -- Populate the round_player_order table with the order for the rest of the players
        FOR i IN 1..array_length(remaining_players, 1)
        LOOP
            INSERT INTO round_player_order (round_id, player_id, order_of_play)
            VALUES (round_id, remaining_players[i], i + 1); -- i + 1 because the game creator is already inserted as the first player
        END LOOP;

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
    total_players INT;          -- Variable to store the total number of players associated with the game
    accepted_count INT;         -- Variable to store the count of players who've accepted the game invitation
    game_state game_status;     -- Variable to store the updated game status
BEGIN
    -- 1. Remove the user's association from the game since they declined the invitation.
    -- This deletes the user's record from the game_players table.
    DELETE FROM game_players 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- 2. After removing the declining user, calculate the total remaining players 
    -- and the number of those who've accepted the invitation.
    SELECT COUNT(*), 
           COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- 3. Decide the updated status of the game based on the counts from the previous step.
    -- If all remaining players have accepted, the game is either active or abandoned 
    -- (if there's only one player left). If not all have accepted, the game remains in pending status.
    IF accepted_count = total_players THEN
        -- If only one player has accepted (meaning they're the only one left), 
        -- the game is marked as abandoned. Otherwise, it's marked as active.
        game_state := CASE WHEN total_players = 1 THEN 'abandoned' ELSE 'active' END;
    ELSE
        -- If not all remaining players have accepted, the game's status remains as pending.
        game_state := 'pending';
    END IF;

    -- 4. Update the game's status in the games table to reflect the changes.
    UPDATE games SET status = game_state WHERE id = p_game_id;

    -- 5. Return the updated game status.
    RETURN game_state;
END;
$$ LANGUAGE plpgsql;
