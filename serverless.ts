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
    resources: {
        Resources: {
            StreamingFunctionLambdaFunctionUrl: { // find "Lambda::Url" resource : https://github.com/serverless/serverless/issues/11906#issuecomment-1565686984
                Type: 'AWS::Lambda::Url',
                Properties: {
                    InvokeMode: "RESPONSE_STREAM"
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
