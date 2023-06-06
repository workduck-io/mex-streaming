import fetch from 'node-fetch';
import { TextDecoder } from 'util';

// Define your OpenAI API key and URL
const API_KEY = process.env.OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

// Assume promptInput and resultText are defined elsewhere
let promptInput = { value: 'Mahabharata in less than 100 words' };
let resultText = { innerText: '' };

const generate = async () => {
    try {
        // Fetch the response from the OpenAI API with the signal from AbortController
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptInput.value }],
                stream: true
            }),
        });

        // Create a TextDecoder to decode the stream
        const decoder = new TextDecoder("utf-8");

        // Handle each chunk of data
        response.body.on('data', (chunk) => {
            // Decode the chunk and remove the "data: " prefix
            const text = decoder.decode(chunk).replace(/^data: /, "");

            // Split the text by newline characters and parse each line as JSON
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.trim() !== '') {
                    const data = JSON.parse(line);

                    // Extract the message from the data and append it to the result text
                    const message = data.choices[0].message.content;
                    resultText.innerText += message;
                }
            }
        });

        // Handle the end of the stream
        response.body.on('end', () => {
            console.log(`Full conversation received: ${resultText.innerText}`);
        });

        // Handle errors
        response.body.on('error', (error) => {
            console.error("Error:", error);
            resultText.innerText = "Error occurred while generating.";
        });
    } catch (error) {
        console.error("Error:", error);
        resultText.innerText = "Error occurred while generating.";
    }
};

generate();
