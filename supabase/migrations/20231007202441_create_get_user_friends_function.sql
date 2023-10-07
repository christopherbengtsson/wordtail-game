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
