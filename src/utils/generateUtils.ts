import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseChatMessage } from 'langchain/schema';
import { getDetails, updateTokenUsage } from './lambdaUtils';
import {
  getMessagesForAnalysis,
  getMessagesForOutreach,
} from './messageFormatterUtils';
import { analysisParser, outreachParser } from './parserUtils';

async function generateResponse(
  apiKey: string,
  request: string,
  getMessagesInLangchainFormat: Function,
  parser: Function
): Promise<any> {
  const chat = new ChatOpenAI({
    openAIApiKey: apiKey,
  });

  try {
    console.log('Inside Generate Response');
    const llmResponse: BaseChatMessage = await chat.call(
      getMessagesInLangchainFormat(JSON.parse(request))
    );
    return await parser(llmResponse);
  } catch (error) {
    console.log('Error in createMessage fn : ' + error);
    throw error;
  }
}

export const handleOutreachEmail = async (
  body: string,
  workspaceId: string,
  bearerToken: string
): Promise<any> => {
  const { apiKey, isSystemToken } = await getDetails(
    body,
    workspaceId,
    bearerToken
  );
  const response = await generateResponse(
    apiKey,
    body,
    getMessagesForOutreach,
    outreachParser
  );
  if (isSystemToken) {
    await updateTokenUsage(workspaceId, bearerToken);
  }
  return response;
};

export const handleCallAnalysis = async (
  body: string,
  workspaceId: string,
  bearerToken: string
): Promise<any> => {
  console.log('Inside Call Analysis');
  const { apiKey, isSystemToken } = await getDetails(
    body,
    workspaceId,
    bearerToken
  );
  console.log('API KEY : ' + apiKey);
  console.log('isSystemToken : ' + isSystemToken);
  const response = await generateResponse(
    apiKey,
    body,
    getMessagesForAnalysis,
    analysisParser
  );
  if (isSystemToken) {
    await updateTokenUsage(workspaceId, bearerToken);
  }
  return response;
};
