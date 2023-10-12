import type { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
    streamingFunction: {
        handler: 'src/lambdas/http/handler.handleRequest',
        url: {
            cors: true,
        },
        timeout: 20
    },
    moderator: {
        handler: 'src/lambdas/moderator/handler.handleRequest',
        url: {
            cors: true,
        },
        timeout: 120
    }
}

export default functions;
