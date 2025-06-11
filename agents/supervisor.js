import { conciseAssistant } from "./conciseAssistant.js";
import { detailedAssistant } from "./detailedAssistant.js";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";

// Define the root annotation for the supervisor graph
const supervisorAnnotation = Annotation.Root({
  messages: Annotation({
    default: () => [],
  }),
});

// Create the supervisor graph
const supervisorGraph = new StateGraph(supervisorAnnotation)
  .addNode("concise", conciseAssistant)
  .addNode("detailed", detailedAssistant)
  .addEdge(START, "concise")
  .addEdge("concise", "detailed")
  .addEdge("detailed", END);

const supervisorAgent = supervisorGraph.compile();

export { supervisorAgent };