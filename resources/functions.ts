import type { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
    websockets: {
        handler: 'src/lambdas/websockets/handler.handleRequest',
        events: [
            {
                websocket: {
                    route: '$connect',
                },
            },
            {
                websocket: {
                    route: '$disconnect',
                },
            },
            {
                websocket: {
                    route: '$default',
                },
            },
            {
                websocket: {
                    route: 'sendMessage',
                },
            },
        ],
    },
}

export default functions;
