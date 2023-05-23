import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";


export interface WebsocketInterface {
    process(event: APIGatewayProxyWebsocketEventV2): Promise<{ statusCode: number; body: string; }>
}