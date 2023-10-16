-- ================================================
-- Function: internal_delete_notification
-- Description: 
--    Internal function to mark a notification as read.
--
-- Parameters:
--    - p_user_id: The ID of the player receving the update.
--    - p_reference_id: A generic reference parameter, e.g. when creating, it's the game_id.
--
-- ================================================
CREATE OR REPLACE FUNCTION internal_delete_notification(p_user_id UUID, p_reference_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM notifications
    WHERE user_id = p_user_id AND reference_id = p_reference_id;
END;
$$ LANGUAGE plpgsql;
