-- ================================================
-- Function: perform_http_get_from_server
-- Description: 
--    General function to fetch data from an external API endpoint.
--
-- Parameters:
--    - p_api_endpoint: The URL endpoint of the external API to call.
--    - p_content_type: Desired content type ('text' or 'json'), defaults to 'json'.
--
-- Returns: 
--    JSONB object containing status and data (HTML or JSON) or an error message.
--
-- Notes: 
--    - This function assumes that the "http" extension is enabled.
--    - The function only performs a GET request.
-- ================================================
CREATE OR REPLACE FUNCTION perform_http_get_from_server(p_api_endpoint TEXT, p_content_type TEXT DEFAULT 'json') 
RETURNS JSONB AS $$
DECLARE
    api_response RECORD;    -- To hold the response from the API call.
    data_content JSONB;     -- To hold the processed content based on the specified content type.
BEGIN
    -- Use the http_get function to fetch the content.
    SELECT 
        "status",
        "content"
    INTO api_response
    FROM http_get(p_api_endpoint);

    -- Process the content based on the desired content type.
    IF p_content_type = 'text' THEN
        data_content := to_jsonb(api_response.content::TEXT);
    ELSE
        data_content := api_response.content::JSONB;
    END IF;

    -- If the status is 200 (HTTP OK), return the processed content in JSON format. 
    IF api_response.status = 200 THEN
        RETURN jsonb_build_object('status', 'success', 'data', data_content);
    ELSE
        RETURN jsonb_build_object('status', 'error', 'message', format('Failed with HTTP status: %s', api_response.status));
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('status', 'error', 'message', format('Error processing content: %s', SQLERRM));

END;
$$ LANGUAGE plpgsql;
