-- Enable the "pg_cron" extension
create extension pg_cron with schema extensions;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule (
    'E2E-games-cleanup', -- name of the cron job
    '0 23 * * 0', -- Sunday at 23:00 (GMT)
    $$ delete from games where name = 'E2E TEST GAME' $$
);

-- ================================================
-- Function: accept_game_invitation
-- Description: 
--    Allows a user to accept an invitation to a game.
--    If all players have accepted, the game is set to 'active' and the rounds are initiated.
--
-- Parameters:
--    - p_game_id: The ID of the game to accept the invitation for.
--    - p_user_id: The ID of the user accepting the invitation.
--
-- Returns: 
--    A game_status indicating the current status of the game after the invitation is accepted.
--
-- Notes: 
--    - This function assumes the existence of the required tables and relationships among them.
--    - Game starts once all players have accepted the invitation.
-- ================================================
CREATE OR REPLACE FUNCTION accept_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    game_creator_id UUID;
    starting_player UUID;
    second_player UUID;
    loop_player_id UUID;
BEGIN
    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, p_game_id);
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
    SELECT creator_id INTO game_creator_id FROM games WHERE id = p_game_id;

    -- Decide the starting player
    IF accepted_count = total_players THEN
        game_state := 'active';
        starting_player := p_user_id;
        second_player := game_creator_id;
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
    UPDATE games 
    SET status = game_state, updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_game_id;

    -- Notify players
    FOR loop_player_id IN SELECT user_id FROM game_players WHERE game_id = p_game_id AND invitation_status = 'accepted'
    LOOP
        PERFORM internal_add_notification(loop_player_id, 'game_move_turn', round_id);
    END LOOP;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Function: decline_game_invitation
-- Description: 
--    Allows a user to decline an invitation to a game.
--    If the number of players is reduced to 1, the game is marked 'abandoned'.
--    If there are more players left and all have accepted, the game status is set to 'active' with a different round setup.
--
-- Parameters:
--    - p_game_id: The ID of the game to decline the invitation for.
--    - p_user_id: The ID of the user declining the invitation.
--
-- Returns: 
--    A game_status indicating the current status of the game after the invitation is declined.
--
-- Notes: 
--    - This function assumes the existence of the required tables and relationships among them.
--    - The game can either be 'abandoned', 'pending', or 'active' depending on the decisions of the players.
-- ================================================
CREATE OR REPLACE FUNCTION decline_game_invitation(p_game_id UUID, p_user_id UUID)
RETURNS game_status AS $$
DECLARE
    total_players INT;
    accepted_count INT;
    game_state game_status;
    round_id UUID;
    game_creator_id UUID;
    loop_player_id UUID;
BEGIN
    -- Remove notification
    PERFORM internal_delete_notification(p_user_id, p_game_id);

    -- Remove the user's association from the game
    DELETE FROM game_players 
    WHERE game_id = p_game_id AND user_id = p_user_id;

    -- Calculate total remaining players and the number of accepted invitations
    SELECT COUNT(*), COUNT(CASE WHEN invitation_status = 'accepted' THEN 1 END)
    INTO total_players, accepted_count 
    FROM game_players 
    WHERE game_id = p_game_id;

    -- Fetch the game creator's ID
    SELECT creator_id INTO game_creator_id FROM games WHERE id = p_game_id;

    -- Decide the game status
    IF accepted_count = total_players THEN
        game_state := CASE WHEN total_players = 1 THEN 'abandoned' ELSE 'active' END;
    ELSE
        game_state := 'pending';
    END IF;

    -- Early return if the game is either pending or abandoned
    IF game_state IN ('pending', 'abandoned') THEN
        UPDATE games 
        SET status = game_state, updated_at = (now() at time zone 'utc'::text)
        WHERE id = p_game_id;
        RETURN game_state;
    END IF;

    -- Insert the first round into the game_rounds table
    INSERT INTO game_rounds (game_id, round_number, status, current_player_id)
    VALUES (p_game_id, 1, 'active', game_creator_id)
    RETURNING id INTO round_id;

    -- Random order for the players (starting with the game creator)
    INSERT INTO round_player_order (round_id, player_id, order_of_play)
    SELECT round_id, user_id, row_number() OVER ()
    FROM game_players 
    WHERE game_id = p_game_id
    ORDER BY CASE WHEN user_id = game_creator_id THEN 0 ELSE 1 END, RANDOM();

    -- Update the game's status in the games table
    UPDATE games 
    SET status = game_state, updated_at = (now() at time zone 'utc'::text)
    WHERE id = p_game_id;

    -- Notify players
    FOR loop_player_id IN SELECT user_id FROM game_players WHERE game_id = p_game_id AND invitation_status = 'accepted'
    LOOP
        PERFORM internal_add_notification(loop_player_id, 'game_move_turn', round_id);
    END LOOP;

    RETURN game_state;
END;
$$ LANGUAGE plpgsql;
