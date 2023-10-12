import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';

function getMessagesInLangchainFormat(messages) {
  const allMessages = [];
  for (const message of messages) {
    if (message.role === 'user') {
      allMessages.push(new HumanChatMessage(message.content));
    } else if (message.role === 'system') {
      allMessages.push(new SystemChatMessage(message.content));
    } else if (message.role === 'assistant') {
      allMessages.push(new AIChatMessage(message.content));
    }
  }
  return allMessages;
}

/*
Request Format : 
{
    "user_contact" : {
        "name" : "Varun Garg", 
        "email" : "varun.garg@workduck.io",
        "company" : "Workduck", 
        "title" : "Backend Engineer",
        "location" : "Bangalore"
    },
    "template_message" : "Hi $name. Hope you're doing well. We're from a company called Workduck which helps you handle your lead management while you can focus on what is important, i.e. Generating Leads. "
}


*/

function getMessagesForOutreach(request: any) {
  try {
    const systemMessage: SystemChatMessage = new SystemChatMessage(
      'You are the best outreach message generator in the world who personalizes the messages based on the information available'
    );

    const humanMessage: HumanChatMessage = new HumanChatMessage(
      'I have a message that I want to send to a potential lead : \n' +
        `${request.template_message} \n` +
        'This will be the overall theme of the message. Look at the user details in the following json and customize it as per the user and ask the user if they are interested, they can schedule a call with us. \n' +
        'JSON \n' +
        `${JSON.stringify(request.user_contact)} \n` +
        "If job title is present, try to see how does the product fit into the user's workflow and customize the message accordingly. Please fill in all the variables yourself by using the customer json & template message \n" +
        "There's only 1 rule you need to follow : Just output a json like this. Don't send any message/ greeting etc apart from the json in the entire response: \n" +
        '`{ msg : Generated Message }`'
    );

    return [systemMessage, humanMessage];
  } catch (error) {
    console.error('Error generating msgs in messageUtils: ' + error);
    throw error;
  }
}

/*
Request Format : 
{
    "call_notes" : "Information about Call Notes"
}

*/

function getMessagesForAnalysis(request: any) {
  try {
    const systemMessage: SystemChatMessage = new SystemChatMessage(
      'You are the best sales person in the world who can very easily understand information and generate summaries and insights from it.'
    );

    const humanMessage: HumanChatMessage = new HumanChatMessage(
      'I have some meeting notes from a call with a lead : \n' +
        `${request.call_notes} \n` +
        'Take the above call notes. Now generate \n' +
        '1. short call summary \n' +
        '2. what actionable steps that can be taken to convert the lead that the sales person might have missed out. If the lead is not interested, the corresponding fields should reflect so. \n' +
        '3.  based on the call notes, generated properties that might be useful. Example \n' +
        'Propensity to pay: High/ Medium/ Low \n' +
        'KT: High/ Medium/ Low \n' +
        'Customisation: High/ Medium/ Low \n' +
        '[ This is just an example, generate 3 to 8 such properties ] \n' +
        "There's only 1 rule you need to follow : Just output a json like this. Don't send any message/ greeting etc apart from the json in the entire response: \n" +
        '{ summary : call summary, steps : [actionable steps], properties : {propertyName : propertyValue}} \n'
    );

    return [systemMessage, humanMessage];
  } catch (error) {
    console.error('Error generating msgs in messageUtils: ' + error);
    throw error;
  }
}

export {
  getMessagesForAnalysis,
  getMessagesForOutreach,
  getMessagesInLangchainFormat,
};
