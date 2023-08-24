import { BaseChatMessage } from "langchain/schema"

const outreachParser = async (llmResponse: BaseChatMessage): Promise<any> => {

    const content: string = llmResponse.text

    try {
        console.log("REPLY FROM LLM : " + content)
        return JSON.parse(content) // expected format from llm is { "msg" : "content" }
    } catch (error) {
        console.log("ERROR!! REPLY FROM LLM : " + content)
        console.log("ERROR : " + error)
        throw error
    }

}

const analysisParser = async (llmResponse: BaseChatMessage): Promise<any> => {

    const content: string = llmResponse.text

    try {
        console.log("REPLY FROM LLM : " + content)
        return JSON.parse(content) // expected format from llm is { summary : call summary, steps : [actionable steps], properties : {propertyName : propertyValue}} 
    } catch (error) {
        console.log("ERROR!! REPLY FROM LLM : " + content)
        console.log("ERROR : " + error)
        throw error
    }

}

export { analysisParser, outreachParser }