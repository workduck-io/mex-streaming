import { isAuthorized } from "../../utils/authorizeUtils";
import { extractToken } from "../../utils/tokenUtils";
import { getMessagesForOutreach } from "../../utils/messageUtils";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getDetails, updateTokenUsage } from "../../utils/lambdaUtils";



const HEADER_WORKSPACE_ID = 'mex-workspace-id';

// Function to initialize and call ChatOpenAI
async function createMessage(apiKey, request) {
    const chat = new ChatOpenAI({
        openAIApiKey: apiKey,
    });

    try {
        const llmResponse = await chat.call(getMessagesForOutreach(request)); // type is BaseChatMessage
        const content = llmResponse.text
        var msg = ""
        try {
            console.log("REPLY FROM LLM : " + content)
            msg = JSON.parse(content).msg
        } catch (error) {
            console.log("ERROR!! REPLY FROM LLM : " + content)
            console.log("ERROR : " + error)
            throw error
        }
        return msg


    } catch (error) {
        console.log("Error in createMessage fn : " + error)
        throw error
    }

}


exports.handleRequest = async (event, context) => {
    console.log("Event : " + JSON.stringify(event))

    const workspaceId = event.headers[HEADER_WORKSPACE_ID];
    const bearerToken = extractToken(event.headers.authorization);
    try {
        await isAuthorized(bearerToken, workspaceId);
    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unauthorized",
            }),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "PUT, GET, HEAD, POST, DELETE, OPTIONS"
                //"Access-Control-Allow-Origin": "*", // Required for CORS support to work
            },
            isBased64Encoded: false
        };
    }

    try {
        const request = JSON.parse(event.body)
        //const apiKey = process.env.OPENAI_API_KEY
        const { apiKey, isSystemToken, messages } = await getDetails(event.body, workspaceId, bearerToken);


        const emailContent = await createMessage(apiKey, request)

        if (isSystemToken) {
            await updateTokenUsage(workspaceId, bearerToken);
        }


        return {
            statusCode: 200,
            body: JSON.stringify(emailContent),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "PUT, GET, HEAD, POST, DELETE, OPTIONS"
                //"Access-Control-Allow-Origin": "http://localhost:3333", // Required for CORS support to work
            },
            isBased64Encoded: false
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error,
            }),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "PUT, GET, HEAD, POST, DELETE, OPTIONS"
                //"Access-Control-Allow-Origin": "*", // Required for CORS support to work
            },
            isBased64Encoded: false
        };
    }

};
