import { isAuthorized } from '../../utils/authorizeUtils';
import {
  handleCallAnalysis,
  handleOutreachEmail,
} from '../../utils/generateUtils';
import { buildResponse } from '../../utils/responseUtils';
import { extractToken } from '../../utils/tokenUtils';

const HEADER_WORKSPACE_ID = 'mex-workspace-id';

export const handleRequest = async event => {
  try {
    const workspaceId = event.headers[HEADER_WORKSPACE_ID];
    const bearerToken = extractToken(event.headers.authorization);

    await isAuthorized(bearerToken, workspaceId);
    const body = JSON.parse(event.body);
    let response;

    switch (body.type) {
      case 'outreach_email':
        response = await handleOutreachEmail(
          event.body,
          workspaceId,
          bearerToken
        );
        break;
      case 'call_analysis':
        response = await handleCallAnalysis(
          event.body,
          workspaceId,
          bearerToken
        );
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
