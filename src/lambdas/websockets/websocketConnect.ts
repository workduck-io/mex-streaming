import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { WebsocketInterface } from "./websocketInterface";



export class WebsocketConnect implements WebsocketInterface {
    async process(event: APIGatewayProxyWebsocketEventV2): Promise<{ statusCode: number; body: string; }> {
        console.log(JSON.stringify(event))
        const connectionId = event.requestContext.connectionId;
        console.log('Client connected:', connectionId);
        return { statusCode: 200, body: 'Connected with' + connectionId };
    }

}