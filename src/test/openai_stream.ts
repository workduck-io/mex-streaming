import { Configuration, OpenAIApi } from 'openai';
import { performance } from 'perf_hooks';

// Define your OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Set up the OpenAI API with your API key
const config = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const generate = async () => {
    const startTime = performance.now();

    // Send a ChatCompletion request to count to 100
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: 'Count to 100, with a comma between each number and no newlines. E.g., 1, 2, 3, ...' }
        ],
        temperature: 0,
        stream: true
    });

    console.log(response)

    // Create variables to collect the stream of chunks
    const collectedChunks = [];
    const collectedMessages = [];




    // Iterate through the stream of events
    /*
    for (const chunk of response.data.choices) {
        const chunkTime = performance.now() - startTime;  // Calculate the time delay of the chunk
        collectedChunks.push(chunk);  // Save the event response
        //const chunkMessage = chunk.content;  // Extract the message
        // collectedMessages.push(chunkMessage);  // Save the message
        console.log(`Message received ${chunkTime.toFixed(2)} seconds after request: ${chunk}`);  // Print the delay and text
    }

    // Print the time delay and text received
    console.log(`Full response received ${performance.now() - startTime} seconds after request`);
    const fullReplyContent = collectedMessages.join('');
    console.log(`Full conversation received: ${fullReplyContent}`);*/
};

generate();
