import { Document } from "langchain/dist/document";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


const loader: CheerioWebBaseLoader = new CheerioWebBaseLoader(
    "https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array/11227902#11227902",
);

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});


const pinecone = new PineconeClient();


/* https://js.langchain.com/docs/modules/indexes/document_loaders/examples/web_loaders/web_cheerio */
/* https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone */
async function loadDocuments() {
    const docs: Document[] = await loader.load();

    console.log(docs.length)
    console.log(process.env.PINECONE_API_KEY)

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000, chunkOverlap: 100 })
    const splitDocs = await textSplitter.splitDocuments(docs)

    await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: "us-west4-gcp-free",
    });

    const pineconeIndex = pinecone.Index("cheerio-test");

    console.log(splitDocs.length);


    await PineconeStore.fromDocuments(
        splitDocs, embeddings, { pineconeIndex, }
    );


    //const documentRes = await embeddings.embedDocuments(["Hello world", "Bye bye"]);
    // Do something with docs
}

loadDocuments();
