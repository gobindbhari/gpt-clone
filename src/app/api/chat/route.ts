import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"
import { GROQ_API_KEY, TAVILY_API_KEY } from "@/lib/constants";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";
import { webSearch } from "@/lib/helperFc";


const groq = new Groq({ apiKey: GROQ_API_KEY! });
const tvly = tavily({ apiKey: TAVILY_API_KEY! });

const systemMsg = `you name is gobind singh.
        rules:
        - do not intruduce yourself on every message if user ask this then answer only.

        you have access to following tools:
        - webSearch({query}: {query: string}) // Search latest and realtime data on internet.
        `;


// export async function GET(req: Request) {
export async function POST(req: Request) {
    const reqBody = await req.json(); 
    const { text } = reqBody;
    try {
        // const query = req.query.promt
        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: systemMsg,
            },
            {
                role: "user",
                content: `${text}`
                // content: `what was iphone 17 pro launched?`
            }
        ];

        while (true) {
            console.log("messages --------------", messages);

            const completion = await groq.chat.completions.create({
                // model: "llama-3.3-70b-versatile",
                model: "openai/gpt-oss-120b",

                temperature: 0, // 0 - 2
                messages: messages,
                tool_choice: "auto",
                tools: [
                    {
                        "type": "function",
                        "function": {
                            "name": "webSearch",
                            "description": "Search latest and realtime data on internet.",
                            "parameters": {
                                // JSON Schema object
                                "type": "object",
                                "properties": {
                                    "query": {
                                        "type": "string",
                                        "description": "The search query to perfome search on."
                                    },
                                },
                                "required": ["query"]
                            }
                        }
                    }
                ]
            })

            console.log("completion.choices[0] ----->>>>", completion.choices[0]);

            const assistantMessage = completion.choices[0].message;
            messages.push(assistantMessage);
            const toolCalls = completion.choices[0]?.message.tool_calls

            if (!toolCalls) {
                return NextResponse.json({ data: completion.choices[0].message }, { status: 200 });
                // break;
            }


            for (const tool of toolCalls) {
                console.log("tool --", tool);
                const fcName = tool.function.name
                const fcParams = tool.function.arguments

                if (fcName === "webSearch") {
                    const toolResult = await webSearch(JSON.parse(fcParams))
                    console.log("tool calling...", toolResult);
                    messages.push({
                        role: "tool",
                        content: JSON.stringify({ answer: toolResult }),
                        tool_call_id: tool.id
                    })
                }

            }

            // return NextResponse.json({ data: completion.choices[0].message }, { status: 200 });
        }


    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}