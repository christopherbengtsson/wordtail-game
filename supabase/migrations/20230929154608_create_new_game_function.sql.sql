CREATE OR REPLACE FUNCTION create_new_game(p_game_name TEXT, p_player_ids UUID[], p_creator_id UUID, p_max_number_of_marks INT)
RETURNS UUID AS $$
DECLARE
    new_game_id UUID;           -- Holds the ID of the newly created game.
    all_player_ids UUID[];     -- List of all player IDs including the creator.
    idx INT;                    -- Counter for the loop iteration.
    player_id UUID;             -- Holds the current player ID in the loop.
BEGIN
    -- Check if the creator_id is already included in the player_ids.
    -- If not, append it to the list. Otherwise, use the provided list as is.
    IF p_creator_id = ANY(p_player_ids) THEN
        all_player_ids := p_player_ids;
    ELSE
        all_player_ids := p_player_ids || ARRAY[p_creator_id];
    END IF;

    -- Insert a new game record with the provided details.
    -- Fetch the ID of this new game for later use.
    INSERT INTO games (name, starter_id, status, max_number_of_marks)
    VALUES (p_game_name, p_creator_id, 'pending', p_max_number_of_marks)
    RETURNING id INTO new_game_id;

    -- Iterate through the combined list of player IDs to add each player to the game.
    FOR idx IN 1 .. array_length(all_player_ids, 1)
    LOOP
        player_id := all_player_ids[idx];

        -- Insert each player into the game_players table.
        -- The creator's status is set to 'accepted' by default since they are the one starting the game.
        -- Other players' statuses are set to 'pending'.
        INSERT INTO game_players (game_id, user_id, invitation_status)
        VALUES (new_game_id, player_id, 
            CASE 
                WHEN player_id = p_creator_id THEN 'accepted'::game_invitation_status 
                ELSE 'pending'::game_invitation_status 
            END);
    END LOOP;

    -- Return the ID of the newly created game.
    RETURN new_game_id;
END;
$$ LANGUAGE plpgsql;
