import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda';

const REGION = 'us-east-1';
const FUNCTION_NAME = 'gpt3Prompt-test-main';

interface Details {
  apiKey: string;
  isSystemToken: boolean;
  messages: string[];
}

function handleStatusCode(statusCode: number, body: string) {
  if (!(statusCode >= 200 && statusCode < 300)) {
    throw Error(body);
  }
}

// Lambda invocation function
async function getDetails(
  requestBody: string | null,
  workspaceId: string,
  authorizationToken: string
): Promise<Details> {
  const parsedRequestBody = requestBody ? JSON.parse(requestBody) : null;

  const params = {
    FunctionName: FUNCTION_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      routeKey: 'POST /prepare',
      headers: {
        'mex-workspace-id': workspaceId,
        authorization: authorizationToken,
      },
      body: parsedRequestBody,
    }),
  };

  const lambdaClient = new Lambda({ region: REGION });
  let parsedResponse;
  try {
    const data = await lambdaClient.send(new InvokeCommand(params));
    parsedResponse = JSON.parse(new TextDecoder('utf8').decode(data.Payload));
    handleStatusCode(parsedResponse.statusCode, parsedResponse.body);
  } catch (error) {
    throw Error(error.message);
  }

  const { userFlag, apiKey, body } = parsedResponse;
  const messages = JSON.parse(body).request.messages;
  const key = userFlag ? apiKey : process.env.OPENAI_API_KEY;
  return { apiKey: key, isSystemToken: !userFlag, messages };
}

async function updateTokenUsage(
  workspaceId: string,
  authorizationToken: string
): Promise<void> {
  const params = {
    FunctionName: FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify({
      routeKey: 'PUT /details/limit',
      headers: {
        'mex-workspace-id': workspaceId,
        authorization: authorizationToken,
      },
    }),
  };

  const lambdaClient = new Lambda({ region: REGION });
  try {
    const response = await lambdaClient.send(new InvokeCommand(params));
    console.log(response);
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getDetails, updateTokenUsage };
