import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// Define state type
export interface GraphState {
  input: string;
  output?: string;
}

// Create model
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Node function
async function callModel(state: GraphState): Promise<GraphState> {
  const response = await model.invoke(state.input);

  return {
    ...state,
    output: response.content as string,
  };
}

// Build graph
export const graph = new StateGraph<GraphState>()
  .addNode("callModel", callModel)
  .setEntryPoint("callModel")
  .addEdge("callModel", END)
  .compile();