import { buildLLM } from "../etc/utils.js";
import { SystemMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";

const llm = buildLLM();

const conciseAnnotation = Annotation.Root({
  messages: Annotation({
    default: () => [
      new SystemMessage("You are a concise assistant. Provide short and accurate responses."),
    ],
  }),
});

const callModel = async (state) => {
  const { messages } = state;
  const result = await llm.invoke(messages);
  return { messages: [result] };
};

const conciseGraph = new StateGraph(conciseAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addEdge("agent", END);

const conciseAssistant = conciseGraph.compile();

export { conciseAssistant };