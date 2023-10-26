-- ================================================
-- Function: internal_perform_http_get_from_server
-- Description: 
--    Internal function to fetch data from an external API endpoint, 
--    intended to be called from another database function.
--
-- Parameters:
--    - p_api_endpoint: The URL endpoint of the external API to call.
--
-- Returns: 
--    A RECORD containing:
--    - status: 'success' or 'error'
--    - data: Content received (HTML or JSON)
--    - message: Error message (if applicable)
--
-- Notes: 
--    - This function assumes that the "http" extension is enabled.
--    - The function only performs a GET request.
-- ================================================
CREATE OR REPLACE FUNCTION internal_perform_http_get_from_server(
    p_api_endpoint TEXT
) 
RETURNS TABLE (
    status TEXT, 
    data TEXT, 
    message TEXT
) AS $$
DECLARE
    api_response RECORD;  -- To hold the response from the API call.
BEGIN
    -- Use the http_get function to fetch the content.
    SELECT 
        hg."status",
        hg."content"
    INTO api_response
    FROM http_get(p_api_endpoint) AS hg;

    -- Process the content based on the desired content type.
    data := api_response.content;

    -- If the status is 200 (HTTP OK), return the processed content.
    IF api_response.status = 200 THEN
        status := 'success';
        message := NULL;
    ELSE
        status := 'error';
        message := format('Failed with HTTP status: %s', api_response.status);
    END IF;

    RETURN NEXT;

EXCEPTION
    WHEN OTHERS THEN
        status := 'error';
        message := format('Error in "internal_perform_http_get_from_server": %s', SQLERRM);
        RETURN NEXT;

END;
$$ LANGUAGE plpgsql;
