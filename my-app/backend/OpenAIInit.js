// OpenAIInit.js
import OpenAI from "openai";

const initializeOpenAI = (apiKey) => {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return openai;
};

export default initializeOpenAI;
