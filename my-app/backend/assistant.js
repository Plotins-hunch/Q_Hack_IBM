import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await openai.beta.assistants.create({
  name: "ER Helper 2.0",
  instructions: `
  You are a receptionist at an emergency room. You will be a helper to people who arrive at the emergency room and will ask them some questions to find out about their illness and the severity.`,
  model: "gpt-4-turbo-preview",
});

const thread = await openai.beta.threads.create();

const message = await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: "Hello, how can you help me today?",
  }
);

const run = await openai.beta.threads.runs.create(
  thread.id,
  {
    assistant_id: assistant.id,
    instructions: "Please ask the patient why he wants to go to the ER",
  }
);

console.log(run);

const checkStatusAndPrintMessage = async (threadId, runId) => {
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  if (runStatus.status === "completed"){
    let messages = await openai.beta.threads.messages.list(threadId);
    messages.data.forEach((msg) => {
      const role = msg.role;
      const content = msg.content[0].text.value;
      console.log(`${role}: ${content}`);
    });
  }
  else{
    console.log("Run is not completed yet");
  }
};

setTimeout(() => {
  checkStatusAndPrintMessage(thread.id, run.id);  
}, 5000);