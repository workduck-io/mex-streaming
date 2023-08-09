import { isAuthorized } from "../../utils/authorizeUtils";
import { extractToken } from "../../utils/tokenUtils";
import { getMessagesInLangchainFormat } from "../../utils/messageUtils";
import { invokeAgent } from "../../utils/flowiseUtils";
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
        console.log(context)
        const httpResponseMetadata = {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
            },
        }

        responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata)
        const workspaceId = event.headers[HEADER_WORKSPACE_ID];
        const bearerToken = extractToken(event.headers.authorization);
        await isAuthorized(bearerToken, workspaceId);

        const requestType = JSON.parse(event.body).type
        console.log("Event.Body.Type parsed = " + requestType)
        if (requestType === 'agent') {
            // TODO : check for existence of question field in the body.
            // TODO : add support for multiple intents.
            invokeAgent(event.body, responseStream)

        } else {
            /* call lambda to get apiKey to use & messages in desired format */
            const { apiKey, isSystemToken, messages } = await getDetails(event.body, workspaceId, bearerToken);

            await initiateChat(apiKey, messages, responseStream);

            if (isSystemToken) {
                await updateTokenUsage(workspaceId, bearerToken);
            }
        }


    } catch (error) {
        console.log(error);

        //responseStream.write(`${error}`);
        responseStream.end();
    }
});
