import { buildLLM } from "../etc/utils.js";
import { SystemMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";

const llm = buildLLM();

const detailedAnnotation = Annotation.Root({
  messages: Annotation({
    default: () => [
      new SystemMessage("You are a detailed assistant. Provide in-depth explanations."),
    ],
  }),
});

const callModel = async (state) => {
  const { messages } = state;
  const result = await llm.invoke(messages);
  return { messages: [result] };
};

const detailedGraph = new StateGraph(detailedAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addEdge("agent", END);

const detailedAssistant = detailedGraph.compile();

export { detailedAssistant };