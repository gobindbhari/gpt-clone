"use client";

// components/AIMessage.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useState } from "react";

export default function AIMessage({ content }: { content: string }) {



    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // @ts-ignore
                    code({ inline, className, children, ...props }) {
                        const [text, setText] = useState("Copy")
                        const updateText = (text: string) => {
                            navigator.clipboard.writeText(text)
                            setText("copied")
                            setTimeout(() => {
                                setText("copy")
                            }, 2500)
                        }
                        if (inline) {
                            return (
                                <code className="rounded min-h-10 bg-zinc-700 px-1 my-1 text-sm">
                                    {children}
                                </code>
                            );
                        }
                        const codeText = extractText(children);

                        return (
                            <pre className="relative min-h-10 overflow-x-auto rounded-lg bg-zinc-700 my-2">
                                <button
                                    onClick={() => updateText(codeText)}
                                    className="absolute right-2 top-2 rounded bg-zinc-700 px-2 py-1 text-xs text-white hover:bg-zinc-600"
                                >
                                    {text}
                                </button>
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

function extractText(node: any): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node?.props?.children) return extractText(node.props.children);
    return "";
}