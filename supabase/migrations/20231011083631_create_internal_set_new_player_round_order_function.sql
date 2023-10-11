-- This function establishes the order of play for the new round based on the previous round's order.
CREATE OR REPLACE FUNCTION internal_set_new_player_round_order(
    p_new_round_id UUID, 
    p_starting_player_id UUID, 
    p_current_round_id UUID) 
RETURNS VOID AS $$
DECLARE 
    player_orders UUID[];
    order_idx INT;
BEGIN
    -- Fetch the player order from the current round into an array
    SELECT ARRAY_AGG(player_id ORDER BY order_of_play) 
    INTO player_orders 
    FROM round_player_order 
    WHERE round_id = p_current_round_id;

    -- Find the index of the starting player within the array
    FOR i IN 1..array_length(player_orders, 1) LOOP
        IF player_orders[i] = p_starting_player_id THEN
            order_idx := i;
            EXIT;
        END IF;
    END LOOP;

    -- Adjust the order using the array
    -- The players before the starting player get moved to the end
    player_orders := ARRAY_CAT(
                        ARRAY[player_orders[order_idx]] || 
                        player_orders[order_idx+1:array_length(player_orders, 1)], 
                        player_orders[1:order_idx-1]
                     );

    -- Insert the new order into round_player_order for the new round
    FOR i IN 1..array_length(player_orders, 1) LOOP
        INSERT INTO round_player_order(round_id, player_id, order_of_play)
        VALUES (p_new_round_id, player_orders[i], i);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
