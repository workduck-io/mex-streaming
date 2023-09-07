import * as cosineSimilarity from 'cosine-similarity';
import csv from 'csv-parser';
import * as fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Step 1: Create an embedding for the question
const question = 'What is the update on versioned apis';
const questionParameters = {
  model: 'text-embedding-ada-002',
  input: JSON.stringify(question),
};

async function fetchMatchingThreads(): Promise<void> {
  const questionResp = await openai.createEmbedding(questionParameters);
  const questionEmbedding = questionResp.data.data[0].embedding;

  // Step 2: Calculate the cosine similarity between the question's embedding and each message's embedding
  let allMessages = [];
  fs.createReadStream('embeddings.csv')
    .pipe(csv())
    .on('data', row => {
      allMessages.push(row);
    })
    .on('end', () => {
      try {
        // Step 3: Calculate the cosine similarity between the question's embedding and each message's embedding
        const similarityScores = [];
        for (let message of allMessages) {
          //console.log(message.message)
          //console.log(message.message)
          const messageEmbedding = message.embedding.split(',').map(Number); // assuming the embedding is stored as a JSON string
          const similarityScore = cosineSimilarity(
            questionEmbedding,
            messageEmbedding
          );
          //console.log(similarityScore)
          similarityScores.push({
            message: message.message,
            score: similarityScore,
          });
        }

        //Step 4: Sort the messages by their similarity scores in descending order
        similarityScores.sort((a, b) => b.score - a.score);

        // Step 5: Take the top 3 messages
        const top3Messages = similarityScores.slice(0, 3);

        console.log(top3Messages);
      } catch (error) {
        console.log(error);
      }
    });
}

fetchMatchingThreads();
