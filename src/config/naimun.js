import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// Initialize the thread once and reuse it
let emptyThread = null; 

async function initializeThread() {
    // Checks if thread is empty, and if it is then it creates one
    if (!emptyThread) {
        emptyThread = await openai.beta.threads.create();
    }
    return emptyThread;
}

async function runChat(prompt) {
    const thread = await initializeThread(); // Use the same thread

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user", 
          content: prompt
        }
      );

    const run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        { assistant_id: "asst_AMdC7DBqpqnwRRUBoDlct3mv" }
      );

    const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );

    const aiMessage = messages.data[0].content[0].text.value;

    return aiMessage;
}
  
  export default runChat;