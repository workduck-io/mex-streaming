import type { AWS } from '@serverless/typescript';
import functions from "./resources/functions"
import role from "./resources/role"
import environment from "./resources/environment"

const serverlessConfiguration: AWS = {
    service: 'mex-websockets',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: 'local',
        region: 'us-east-1',
        iam: {
            role
        },
        environment
    },
    functions,
    custom: {
        myStage: '${opt:stage, self:provider.stage}',
    },
};

module.exports = serverlessConfiguration;
