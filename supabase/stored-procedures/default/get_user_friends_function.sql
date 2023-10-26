-- ================================================
-- Function: get_user_friends
-- Description: 
--    Retrieves a list of friends and their friendship status for a given user. 
--    The function checks both cases where the user is either the requester or the receiver of the friendship.
--
-- Parameters:
--    - p_user_id: The ID of the user for whom friends are being fetched.
--
-- Returns: 
--    A table containing friend IDs, their usernames, and the status of their friendship with the given user.
--
-- Usage Example:
--    To get the list of friends for user 'some_user_id':
--    SELECT * FROM get_user_friends('some_user_id');
--
-- Notes: 
--    - This function assumes that friendships are stored in a bi-directional manner, i.e., if A is a friend of B, then B is also a friend of A.
--    - Ensure that the provided user ID is valid. This function does not handle invalid user IDs or provide error messages for them.
-- ================================================
CREATE OR REPLACE FUNCTION get_user_friends(p_user_id UUID)
RETURNS TABLE("friendId" UUID, username TEXT, status friendship_status) AS $$
BEGIN
    RETURN QUERY 
    -- Select friends where the given user is the requester
    SELECT 
        f.receiver_id AS "friendId",
        p.username,
        f.status
    FROM 
        friendships f
    JOIN
        profiles p ON f.receiver_id = p.id
    WHERE 
        f.requester_id = p_user_id 
    UNION 
    -- Select friends where the given user is the receiver
    SELECT 
        f.requester_id AS "friendId",
        p.username,
        f.status
    FROM 
        friendships f
    JOIN
        profiles p ON f.requester_id = p.id
    WHERE 
        f.receiver_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
