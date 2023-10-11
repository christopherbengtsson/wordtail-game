-- ================================================
-- Function: internal_set_new_player_round_order
-- Description: 
--    Establishes the order of play for a new game round. The order is determined based 
--    on the previous round's sequence but starts with the player who initiated the new round.
--
-- Parameters:
--    - p_new_round_id: The ID of the new round.
--    - p_starting_player_id: The ID of the player who starts the new round.
--    - p_current_round_id: The ID of the current or previous round.
--
-- Returns: 
--    VOID - This function updates the database but does not return any value.
--
-- Note: 
--    The function makes use of PostgreSQL arrays to manipulate the order of players efficiently.
-- ================================================
CREATE OR REPLACE FUNCTION internal_set_new_player_round_order(
    p_new_round_id UUID, 
    p_starting_player_id UUID, 
    p_current_round_id UUID) 
RETURNS VOID AS $$
DECLARE 
    player_orders UUID[];
    order_idx INT;
BEGIN
    -- Extract ordered player IDs from the current round and store in an array.
    SELECT ARRAY_AGG(player_id ORDER BY order_of_play) 
    INTO player_orders 
    FROM round_player_order 
    WHERE round_id = p_current_round_id;

    -- Locate the position of the starting player in the retrieved order.
    FOR i IN 1..array_length(player_orders, 1) LOOP
        IF player_orders[i] = p_starting_player_id THEN
            order_idx := i;
            EXIT;
        END IF;
    END LOOP;

    -- Rearrange the order: Position the starting player at the front,
    -- followed by subsequent players, then those before the starter.
    player_orders := ARRAY_CAT(
                        ARRAY[player_orders[order_idx]] || 
                        player_orders[order_idx+1:array_length(player_orders, 1)], 
                        player_orders[1:order_idx-1]
                     );

    -- Record the redefined order for the new round in the database.
    FOR i IN 1..array_length(player_orders, 1) LOOP
        INSERT INTO round_player_order(round_id, player_id, order_of_play)
        VALUES (p_new_round_id, player_orders[i], i);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
