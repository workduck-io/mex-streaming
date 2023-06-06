import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function* chunksToLines(chunksAsync) {
    let previous = "";
    for await (const chunk of chunksAsync) {
        const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        previous += bufferChunk;
        let eolIndex;
        while ((eolIndex = previous.indexOf("\n")) >= 0) {
            // line includes the EOL
            const line = previous.slice(0, eolIndex + 1).trimEnd();
            if (line === "data: [DONE]") break;
            if (line.startsWith("data: ")) yield line;
            previous = previous.slice(eolIndex + 1);
        }
    }
}

async function* linesToMessages(linesAsync) {
    for await (const line of linesAsync) {
        const message = line.substring("data :".length);

        yield message;
    }
}

async function* streamCompletion(data) {
    yield* linesToMessages(chunksToLines(data));
}
// Wrap your main function with the streamifyResponse decorator
exports.handleRequest = awslambda.streamifyResponse(async function (event, responseStream, context) {
    try {

        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: 'Summarize Mahabharata for me' }
            ],
            temperature: 0,
            stream: true,
        }, { responseType: "stream" }
        );

        for await (const message of streamCompletion(completion.data)) {
            try {
                const parsed = JSON.parse(message);
                const text = parsed.choices[0].delta.content
                if (text != undefined) {
                    responseStream.write(text); // Write to the Lambda function's response stream
                }
            } catch (error) {
                console.error("Could not JSON parse stream message", message, error);
            }
        }

        responseStream.write("\n");
        responseStream.end(); // Make sure to end the stream

    } catch (error) {
        // Handle errors as appropriate for your application
    }
});

