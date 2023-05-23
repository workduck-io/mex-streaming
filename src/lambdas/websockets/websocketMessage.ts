import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { WebsocketInterface } from "./websocketInterface";
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Configuration, OpenAIApi } from 'openai';


const apiGateway = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: "https://196686daz1.execute-api.us-east-1.amazonaws.com/test"
});

const sendToConnection = async (connectionId: string, data: any) => {
    return apiGateway
        .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(data),
        })
        .promise();
};

export class WebsocketMessage implements WebsocketInterface {
    async process(event: APIGatewayProxyWebsocketEventV2): Promise<{ statusCode: number; body: string; }> {
        console.log("Inisde Message function")
        const body = JSON.parse(event.body);
        const message = body.message;
        console.log("Message body = " + message)
        const connectionId = event.requestContext.connectionId;
        console.log('Client connected:', connectionId);

        console.log(process.env.OPENAI_API_KEY)

        const config = new Configuration({ //https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
            apiKey: process.env.OPENAI_API_KEY,
        });

        const openai = new OpenAIApi(config)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a useful QnA Tool" },
                { role: "user", content: message }
            ],
        });

        const assistantMessage = completion.data.choices[0].message?.content || '';


        await sendToConnection(connectionId, { message: assistantMessage });
        return { statusCode: 200, body: 'Connected with' + connectionId };
    }

}