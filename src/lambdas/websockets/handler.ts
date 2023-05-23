import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { HandlerFactory } from './handlerFactory';

const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
    //console.log("Hello AWS!")
    console.log(event)
    //console.log("Stringified : " + JSON.stringify(event))
    const eventType = event.requestContext.eventType;

    return HandlerFactory.getWebsocketStrategy(eventType).process(event)
}



export const handleRequest = handler