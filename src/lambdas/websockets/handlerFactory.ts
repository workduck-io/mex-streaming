import { WebsocketInterface } from "./websocketInterface";

import { WebsocketConnect } from "./websocketConnect";
import { WebsocketDisconnect } from "./websocketDisconnect";
import { WebsocketMessage } from "./websocketMessage";
import { WebsocketDefault } from "./websocketDefault";

export class HandlerFactory {

    public static getWebsocketStrategy(eventType: String): WebsocketInterface {
        if (eventType === 'CONNECT') {
            return new WebsocketConnect();
        } else if (eventType === 'DISCONNECT') {
            return new WebsocketDisconnect();
        } else if (eventType === 'MESSAGE') {
            return new WebsocketMessage();
        } else {
            return new WebsocketDefault();
        }

    }

}