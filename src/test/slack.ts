import { WebClient } from '@slack/web-api';
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import * as fs from 'fs';
import * as csvWriter from 'csv-write-stream';
import { send } from 'process';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function fetchMessages(token: string, channel: string): Promise<void> {


    const client = new WebClient(token);

    let result;
    let allMessages = [];

    try {
        do {
            result = await client.conversations.history({
                channel: channel,
                cursor: result ? result.response_metadata.next_cursor : undefined,
            });

            allMessages.push(...result.messages);
        } while (result && result.has_more);
    } catch (error) {
        console.error(JSON.stringify(error));
    }

    let writer = csvWriter();
    writer.pipe(fs.createWriteStream('embeddings.csv'));
    let count = 0

    // const resp = await openai.createEmbedding(parameters); // replace with your method to create embeddings
    // console.log(resp)
    // console.log("------------------")
    // const embedding = resp.data.data[0].embedding; // replace with your method to extract embeddings
    // console.log(embedding)
    // writer.write({ message: allMessages[0].text, embedding: embedding });


    for (let message of allMessages) {
        try {
            let text = { "sender": {}, "message": {} }
            const userInfo = await client.users.info({ user: message.user });
            const sender = userInfo.user.real_name
            text.sender = sender

            count = count + 1
            text.message = message.text
            //console.log(text)
            //console.log("-------------------------")
            const parameters = {
                model: 'text-embedding-ada-002',
                input: JSON.stringify(text),
            }
            const resp = await openai.createEmbedding(parameters); // replace with your method to create embeddings
            const embedding = resp.data.data[0].embedding; // replace with your method to extract embeddings

            writer.write({ message: message.text, embedding: embedding });
            count = count + 1
        } catch (error) {
            console.error(error);
        }


    }
    console.log(count + " embeddings created")
    writer.end();
}

const token = 'xoxb-2165258643458-5335138669746-aXb3ontGCn7X5HmVNZZTKWyS';  // Replace with your Slack token
const channelID = 'C02TKUE0S6P'; // Replace with your channel ID

//fetchMessages(token, channelID);
