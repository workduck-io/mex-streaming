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

async function* streamCompletion(data: CreateChatCompletionResponse) {
    yield* linesToMessages(chunksToLines(data));
}

async function main() {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: 'Count to 100, with a comma between each number and no newlines. E.g., 1, 2, 3, ...' }
            ],
            temperature: 0,
            stream: true,
        }, { responseType: "stream" }
        );

        for await (const message of streamCompletion(completion.data)) {
            try {

                const parsed = JSON.parse(message);
                const text: string = parsed.choices[0].delta.content
                if (text != undefined)
                    process.stdout.write(text);
            } catch (error) {
                console.error("Could not JSON parse stream message", message, error);
            }
        }

        process.stdout.write("\n");

    } catch (error) {
        // if (error.response?.status) {
        //     console.error(error.response.status, error.message);

        //     for await (const data of error.response.data) {
        //         const message = data.toString();

        //         try {
        //             const parsed = JSON.parse(message);

        //             console.error("An error occurred during OpenAI request: ", parsed);
        //         } catch (error) {
        //             console.error("An error occurred during OpenAI request: ", message);
        //         }
        //     }
        // } else {
        //     console.error("An error occurred during OpenAI request", error);
        // }
    }

}

main();