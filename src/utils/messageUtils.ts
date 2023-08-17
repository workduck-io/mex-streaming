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


function getMessagesForOutreach(request) {

    try {
        const systemMessage: SystemChatMessage = new SystemChatMessage("You are the best outreach message generator in the world who personalizes the messages based on the information available")

        const humanMessage: HumanChatMessage = new HumanChatMessage("I have a message that I want to send to a potential lead : \n" +
            `${request.template_message} \n` +
            "This will be the overall theme of the message. Look at the user details in the following json and customize it as per the user and ask the user if they are interested, they can schedule a call with us. \n" +
            "JSON \n" + `${JSON.stringify(request.user_contact)} \n` +
            "If job title is present, try to see how does the product fit into the user's workflow and customize the message accordingly. Please fill in all the variables yourself by using the customer json & template message \n" +
            "There's only 1 rule you need to follow : Just output a json like this. Don't send any message/ greeting etc apart from the json in the entire response: \n" +
            "`{ msg : Generated Message }`")

        console.log("Human Message : " + humanMessage.text);
        return [systemMessage, humanMessage];


    } catch (error) {
        console.log("Error generating msgs in messageUtils: " + error)
        throw error
    }


}

export { getMessagesInLangchainFormat, getMessagesForOutreach }