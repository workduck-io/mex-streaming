import { isAuthorized } from "../../utils/authorizeUtils";
import { extractToken } from "../../utils/tokenUtils";
import { handleOutreachEmail, handleCallAnalysis } from "../../utils/generateUtils";
import { buildResponse } from "../../utils/responseUtils"


const HEADER_WORKSPACE_ID = 'mex-workspace-id';


exports.handleRequest = async (event, context) => {
    console.log("Event : " + JSON.stringify(event));

    try {

        const workspaceId = event.headers[HEADER_WORKSPACE_ID]
        console.log("WorkspaceID : " + workspaceId)

        console.log("token1 : " + event.headers.authorization)
        console.log("token2 : " + event.headers["authorization"])
        const bearerToken = extractToken(event.headers.authorization);


        await isAuthorized(bearerToken, workspaceId);
        const body = JSON.parse(event.body);
        let response;

        switch (body.type) {
            case "outreach_email":
                response = await handleOutreachEmail(event.body, workspaceId, bearerToken);
                break;
            case "call_analysis":
                response = await handleCallAnalysis(event.body, workspaceId, bearerToken);
                break;
            default:
                throw new Error('Invalid request type');
        }

        return buildResponse(200, response);

    } catch (error) {
        if (error.message === 'Unauthorized') {
            return buildResponse(401, { message: 'Unauthorized' });
        } else {
            return buildResponse(500, { message: error.message });
        }
    }
};
