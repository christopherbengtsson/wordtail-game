CREATE OR REPLACE FUNCTION create_new_game(p_game_name TEXT, p_player_ids UUID[], p_creator_id UUID, p_max_number_of_marks INT)
RETURNS UUID AS $$
DECLARE
    new_game_id UUID;           -- Holds the ID of the newly created game.
    all_player_ids UUID[];      -- List of all player IDs including the creator.
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

    -- Insert all players (including the creator) with status 'pending'
    INSERT INTO game_players (game_id, user_id, invitation_status)
    SELECT new_game_id, unnested_player, 'pending'::game_invitation_status
    FROM UNNEST(all_player_ids) AS unnested_player;

    -- Update the creator's status to 'accepted'
    UPDATE game_players
    SET invitation_status = 'accepted'::game_invitation_status
    WHERE game_id = new_game_id AND user_id = p_creator_id;

    -- Return the ID of the newly created game.
    RETURN new_game_id;
END;
$$ LANGUAGE plpgsql;
