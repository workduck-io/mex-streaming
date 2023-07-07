import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const pinecone = new PineconeClient();

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

async function qna() {

    await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: "us-west4-gcp-free",
    });

    const pineconeIndex = pinecone.Index("cheerio-test");

    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex }
    );

    const model = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });


    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 5,
        returnSourceDocuments: false,
    });

    const response = await chain.call({ query: "Can you give me a similar example to railroad junction example used to explain branch prediction" });
    console.log(response);







}


qna()