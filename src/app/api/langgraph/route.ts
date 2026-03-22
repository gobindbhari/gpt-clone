
// steps 
/**
 * 1. define node functions
 * 2. build Graph
 * 3. complie and invoke th Graph
 */

import { MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { GROQ_API_KEY, systemMsg, TAVILY_API_KEY } from "@/lib/constants";
import {
    StateGraph,
    StateSchema,
    MessagesValue,
    ReducedValue,
    GraphNode,
    ConditionalEdgeRouter,
    START,
    END,
} from "@langchain/langgraph";
import { z } from "zod/v4";
import { tool } from "@langchain/core/tools";
import { tavily } from "@tavily/core";
import { webSearchOutputSchema, webSearchSchema } from "@/lib/zodTypes";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";



// We need this because we want to enable threads (conversations)
const checkpointer = new MemorySaver();

// Define state type
const MessagesState = new StateSchema({
    messages: MessagesValue,
    llmCalls: new ReducedValue(
        z.number().default(0),
        { reducer: (x, y) => x + y }
    ),
});


const tvly = tavily({ apiKey: TAVILY_API_KEY! });


// Define tools
const webSearch = tool(async ({ query }: { query: string }) => {
    const response = await tvly.search(query);
    const finalResult = response.results.map(result => result.content)
    // return webSearchOutputSchema.parse(finalResult);
    return finalResult
}, {
    name: "webSearch",
    description: "Search latest and realtime data on internet.",
    schema: webSearchSchema
})


// Augment the LLM with tools
const toolsByName = {
  [webSearch.name]: webSearch,
} as const

type ToolName = keyof typeof toolsByName;

const tools = Object.values(toolsByName);
// const tools = [webSearch]
// const toolNode = new ToolNode(tools);

const toolNode: GraphNode<typeof MessagesState> = async (state) => {
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const toolName = toolCall.name  as ToolName
    const tool = toolsByName[toolName];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
};

// define a llm model 
const modelGroq = new ChatGroq({
    apiKey: GROQ_API_KEY, // Default value.
    //   model: "llama-3.3-70b-versatile",
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxRetries: 5
}).bindTools(tools)



// 1. step ✅
const callModel: GraphNode<typeof MessagesState> = async (state) => {
    // call the llm using api
    const response = await modelGroq.invoke([
        new SystemMessage(
            systemMsg.content as string
        ),
        ...state.messages
    ],
    )
    return {
        messages: [response],
        llmCalls: 1,
    };
}


const shouldContinue: ConditionalEdgeRouter<typeof MessagesState> = (state) => {
    const lastMessage = state.messages.at(-1);

    // If tool call exists → go to tools
    // if (
    //     lastMessage &&
    //     "tool_calls" in lastMessage &&
    //     lastMessage.tool_calls?.length
    // ) {
    //     return "tools";
    // }
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

    if (lastMessage.tool_calls?.length) {
    return "tools";
  }

    // else → end
    return END;
};

// 2. step ✅
// const workFlow = new StateGraph(MessagesAnnotation)
const workFlow = new StateGraph(MessagesState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        [END]: END
    })
    .addEdge("tools", "agent")


    
// 3. step ✅
const app = workFlow.compile({checkpointer})





export async function POST(req: Request) {
    console.log("run ---")

    // return NextResponse.json({response: "run ---"})
    const { message } = await req.json()
    try {

        const finalState = await app.invoke({
            messages: [new HumanMessage(message)],
            // messages: [{ role: "human", content: message }]  // both are same ✅
        },
        {
            configurable: { thread_id: "1"}
        }
        )

        console.log("finalState ---", finalState)
        // console.log("finalState ---", finalState.messages.at(-1)?.content)
        const lastMessage = finalState.messages.at(-1)?.content
        return NextResponse.json({ response: lastMessage }, {status: 200})

    } catch (error) {
        console.log("err --->>>>", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}



// import { StateSchema, MessagesValue, GraphNode, StateGraph, START, END } from "@langchain/langgraph";



// const State = new StateSchema({
//   messages: MessagesValue,
// });