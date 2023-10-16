-- ================================================
-- Function: internal_add_notification
-- Description: 
--    Internal function that inserts new notifications table so clients can subscribe to changes and make updates.
--
-- Parameters:
--    - p_user_id: The ID of the player receving the update.
--    - p_type: Type of notification.
--    - p_reference_id: A generic reference parameter, e.g. when creating, it's the game_id.
--    - p_message: Optional notification message.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_add_notification(p_user_id UUID, p_type notification_type, p_reference_id UUID, p_message TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO notifications(user_id, type, reference_id, message)
    VALUES (p_user_id, p_type, p_reference_id, p_message);
END;
$$ LANGUAGE plpgsql;
