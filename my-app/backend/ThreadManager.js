// ThreadManager.js
import OpenAI from "openai";

const createThread = async (openai) => {
  /*const assistant = await openai.beta.assistants.create({
    name: "ER Helper 2.0",
    instructions: `
      You are a receptionist at an emergency room. You will be a helper to people who arrive at the emergency room and will ask them some questions to find out about their illness and the severity.`,
    model: "gpt-4-turbo-preview",
  });*/
  console.log("here");
  const assistant = await openai.beta.assistants.retrieve(
    "asst_k0jr7ubXZruHFoFwzGtEygn7"
  );
  console.log(assistant);

  const thread = await openai.beta.threads.create();
  return { assistant, thread };
};

const sendMessageAndGetReply = async (openai, threadId, assistantId, messageContent) => {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: messageContent,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions: "Please ask the patient why they want to go to the ER",
  });

  // Check the status of the run and retrieve messages
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  while (runStatus.status !== "completed") {
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  return messages.data.map((msg) => ({
    role: msg.role,
    content: msg.content[0].text.value,
  }));
};

export { createThread, sendMessageAndGetReply };
