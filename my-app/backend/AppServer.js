// AppServer.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import initializeOpenAI from './OpenAIInit.js';
import { createThread, sendMessageAndGetReply } from './ThreadManager.js';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use cors middleware to allow cross-origin requests
app.use(cors());

const openai = initializeOpenAI(process.env.OPENAI_API_KEY);

app.use(bodyParser.json());

app.post('/create-thread', async (_req, res) => {
  try {
    console.log('Creating thread');
    const { assistant, thread } = await createThread(openai);
    res.json({ assistantId: assistant.id, threadId: thread.id });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).send('Error creating thread');
  }
});

app.post('/send-message', async (req, res) => {
  const { threadId, assistantId, message } = req.body;

  try {
    const messages = await sendMessageAndGetReply(openai, threadId, assistantId, message);
    res.json({ messages });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
