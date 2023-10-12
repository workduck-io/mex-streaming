import { BaseChatMessage } from 'langchain/schema';

const outreachParser = async (llmResponse: BaseChatMessage): Promise<any> => {
  const content: string = llmResponse.text;

  try {
    return JSON.parse(content); // expected format from llm is { "msg" : "content" }
  } catch (error) {
    console.error('ERROR!! REPLY FROM LLM : ' + content);
    console.error('ERROR : ' + error);
    throw error;
  }
};

const analysisParser = async (llmResponse: BaseChatMessage): Promise<any> => {
  const content: string = llmResponse.text;

  try {
    return JSON.parse(content); // expected format from llm is { summary : call summary, steps : [actionable steps], properties : {propertyName : propertyValue}}
  } catch (error) {
    console.error('ERROR!! REPLY FROM LLM : ' + content);
    console.error('ERROR : ' + error);
    throw error;
  }
};

export { analysisParser, outreachParser };
