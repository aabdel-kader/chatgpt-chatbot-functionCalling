import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';
import { tools, lookUpTime } from './functionCallingUtils.js';


async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot Program!'));
  console.log(colors.bold.green('You can start chatting with the bot.'));

  const chatHistory = []; // Store conversation history

  // create a variable completion object
  let completion;

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: 'user', content: userInput });

   


      // Call the API with user input & history
      completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        tools:tools,
        messages: messages,
      });


        // check for and handle function calls
     if(completion.data.choices[0].finish_reason === 'tool_calls'){
          const calledFunction = completion.data.choices[0].message.tool_calls[0].function
  
         if(calledFunction.name === 'lookUpTime'){
  
          const functionArgs = JSON.parse(calledFunction.arguments)
          const functionResponse = await lookUpTime(functionArgs.location)
  
           messages.push({ role: 'function', content: functionResponse, name:'lookUpTime' })
  
            completion = await openai.createChatCompletion({
              model: 'gpt-3.5-turbo',
              tools : tools,
             messages: messages,
            });
  
  
          }
  
  
        }
  

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();
