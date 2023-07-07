import { HumanChatMessage, AIChatMessage, SystemChatMessage } from "langchain/schema";

function getMessagesInLangchainFormat(messages) {


    const allMessages = [];
    for (const message of messages) {
        console.log(message)
        if (message.role === "user") {
            allMessages.push(new HumanChatMessage(message.content));
        } else if (message.role === "system") {
            allMessages.push(new SystemChatMessage(message.content));
        } else if (message.role === "assistant") {
            allMessages.push(new AIChatMessage(message.content));
        }
    }

    return allMessages

}

export { getMessagesInLangchainFormat }