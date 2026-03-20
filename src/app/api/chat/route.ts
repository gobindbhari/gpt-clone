import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GROQ_API_KEY, systemMsg } from "@/lib/constants";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";
import { webSearch } from "@/lib/helperFc";


const groq = new Groq({ apiKey: GROQ_API_KEY! });



const messages: ChatCompletionMessageParam[] = [
    systemMsg,
]


// export async function GET(req: Request) {
export async function POST(req: Request) {
    const reqBody = await req.json();
    const { text } = reqBody;

    messages.push({
        role: "user",
        content: text
    })

    console.log("reqBody 33 ----->>>>", reqBody);
    console.log("messages 34----->>>>", messages);
    try {

        let maxRetries = 0

        let lastMessage;

        while (true) {
            console.log("messages 52 --------------", messages);

            if (maxRetries > 5) {
                return NextResponse.json({ data: lastMessage! }, { status: 200 });
                break;
            }
            maxRetries++

            // await groq

            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                // model: "openai/gpt-oss-120b",

                // stream: true,

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

            console.log("completion ----->>>>", completion);
            console.log("completion.choices[0].message.content ----->>>>", completion.choices[0].message.content);

            const assistantMessage = completion.choices[0].message;
            messages.push(assistantMessage);
            const toolCalls = completion.choices[0]?.message.tool_calls

            lastMessage = completion.choices[0].message

            if (!toolCalls) {
                return NextResponse.json({ data: completion.choices[0].message }, { status: 200 });
                // break;
            }


            for (const tool of toolCalls) {
                // console.log("tool --", tool);
                const fcName = tool.function.name
                const fcParams = tool.function.arguments

                if (fcName === "webSearch") {
                    const toolResult = await webSearch(JSON.parse(fcParams))
                    // console.log("tool calling 120 ...", toolResult);
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