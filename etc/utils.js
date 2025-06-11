import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// Build the LLM (Language Model)
const buildLLM = () => new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

export { buildLLM };