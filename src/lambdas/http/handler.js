import { isAuthorized } from "../../utils/authorizeUtils";
import { extractToken } from "../../utils/tokenUtils";
import { getMessagesInLangchainFormat } from "../../utils/messageUtils";
import { getDetails, updateTokenUsage } from "../../utils/lambdaUtils";
import { ChatOpenAI } from "langchain/chat_models/openai";

const HEADER_WORKSPACE_ID = 'mex-workspace-id';

// Function to initialize and call ChatOpenAI
async function initiateChat(apiKey, messages, responseStream) {
    const chat = new ChatOpenAI({
        openAIApiKey: apiKey,
        streaming: true,
        callbacks: [
            {
                handleLLMNewToken(token) {
                    responseStream.write(token);
                },
            },
        ],
    });
    await chat.call(getMessagesInLangchainFormat(messages));
    responseStream.write('\n');
    responseStream.end();
}

exports.handleRequest = awslambda.streamifyResponse(async function (event, responseStream, context) {
    try {
        const httpResponseMetadata = {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        }

        responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata)
        const workspaceId = event.headers[HEADER_WORKSPACE_ID];
        const bearerToken = extractToken(event.headers.authorization);
        await isAuthorized(bearerToken, workspaceId);

        const { apiKey, isSystemToken, messages } = await getDetails(event.body, workspaceId, bearerToken);

        await initiateChat(apiKey, messages, responseStream);

        if (isSystemToken) {
            await updateTokenUsage(workspaceId, bearerToken);
        }
    } catch (error) {
        console.log(error);

        //responseStream.write(`${error}`);
        responseStream.end();
    }
});
