export const buildResponse = (statusCode: number, bodyContent: any) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(bodyContent),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "PUT, GET, HEAD, POST, DELETE, OPTIONS"
            // Add CORS if required
        },
        isBased64Encoded: false
    };
};
