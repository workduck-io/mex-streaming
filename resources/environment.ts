const environment = {
    // AWS_ACCESS_KEY_ID: '${env:AWS_ACCESS_KEY_ID}',
    // AWS_SECRET_ACCESS_KEY: '${env:AWS_SECRET_ACCESS_KEY}',
    OPENAI_API_KEY: '${env:OPENAI_API_KEY}',
    PINECONE_API_KEY: '${env:PINECONE_API_KEY}',
    STAGE: '${self:custom.myStage}',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
}

export default environment