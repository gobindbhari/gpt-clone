"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import type { ToolUIPart } from "ai";
import { CheckIcon, GlobeIcon, MicIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import axios from "axios";
import SidebarDemo from "@/components/SidebarDemo";



interface MessageType {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
}

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
];

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const Page = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [isThinking, setIsThinking] = useState(false)
  const [text, setText] = useState<string>("");
  // const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  // const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  // const [useMicrophone, setUseMicrophone] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [_streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const selectedModelData = models.find((m) => m.id === model);

  const [batches, setBatches] = useState<any[]>([]);
  const [currentBatchId, setCurrentBatchId] = useState("");

  // const batchId = useRef(nanoid())
  // const currenBatchId = ""

  useEffect(() => {
    const stored = sessionStorage.getItem("chatHistory");

    if (!stored) {
      const newBatchId = nanoid();

      const initial = {
        currentBatchId: newBatchId,
        batches: [
          {
            id: newBatchId,
            messages: [],
          },
        ],
      };

      sessionStorage.setItem("chatHistory", JSON.stringify(initial));
      setBatches(initial.batches);
      setCurrentBatchId(newBatchId);
    }
  }, []);

  // load current chat
  useEffect(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    const current = parsed.batches.find(
      (b: any) => b.id === parsed.currentBatchId
    );

    if (current) setMessages(current.messages);
  }, []);

  // save chats
  useEffect(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    const updatedBatches = parsed.batches.map((batch: any) =>
      batch.id === parsed.currentBatchId
        ? { ...batch, messages }
        : batch
    );

    const updated = {
      ...parsed,
      batches: updatedBatches,
    };

    sessionStorage.setItem("chatHistory", JSON.stringify(updated));

    // update UI state too
    setBatches(updatedBatches);
  }, [messages]);

  const createNewChat = () => {
    const stored = sessionStorage.getItem("chatHistory");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    const currentBatch = parsed.batches.find(
      (b: any) => b.id === parsed.currentBatchId
    );

    //  MAIN CHECK
    if (!currentBatch || currentBatch.messages.length === 0) {
      return; // don't create new chat if current is empty
    }

    const newBatchId = nanoid();

    const updated = {
      currentBatchId: newBatchId,
      batches: [
        ...parsed.batches,
        { id: newBatchId, messages: [] },
      ],
    };

    sessionStorage.setItem("chatHistory", JSON.stringify(updated));

    setCurrentBatchId(newBatchId);
    setBatches(updated.batches);
    setMessages([]);
  };

  const switchChat = (id: string) => {
    const stored = sessionStorage.getItem("chatHistory");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    const batch = parsed.batches.find((b: any) => b.id === id);
    if (!batch) return;

    const updated = {
      ...parsed,
      currentBatchId: id,
    };

    sessionStorage.setItem("chatHistory", JSON.stringify(updated));

    setCurrentBatchId(id);
    setMessages(batch.messages);
  };

  const deleteChat = (id: string) => {
    const stored = sessionStorage.getItem("chatHistory");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    if (parsed.batches.length === 1) {
      toast.error("At least one chat required");
      return;
    }

    const updatedBatches = parsed.batches.filter((b: any) => b.id !== id);

    let newCurrentId = parsed.currentBatchId;

    // if deleting current chat → switch to another
    if (id === parsed.currentBatchId) {
      newCurrentId = updatedBatches[0]?.id || "";
    }

    const updated = {
      currentBatchId: newCurrentId,
      batches: updatedBatches,
    };

    sessionStorage.setItem("chatHistory", JSON.stringify(updated));

    setBatches(updatedBatches);
    setCurrentBatchId(newCurrentId);

    const newCurrent = updatedBatches.find((b: any) => b.id === newCurrentId);
    setMessages(newCurrent?.messages || []);
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    console.log("message ----------=======>>>>>>>>>", message)
    if (!(hasText || hasAttachments)) {
      return;
    }
    const userMessageId = nanoid();

    const userMessage: MessageType = {
      key: userMessageId,
      from: "user",
      versions: [
        {
          id: userMessageId,
          content: message.text,
        },
      ],
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true)

    setStatus("submitted");

    if (message.files?.length) {
      toast.success("Files attached", {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    // addUserMessage(message.text || "Sent with attachments");
    setText("");

    try {
      const userQuery = {
        text: message.text,
        files: message.files && message.files,
        // model,
      }
      const res = await axios.post("/api/chat", userQuery)
      const assistantMessageId = nanoid();

      console.log("res 492 ========>>>>>>>", res);

      const assistantMessage: MessageType = {
        key: assistantMessageId,
        from: "assistant",
        // reasoning: res.data.data.content
        //   ? {
        //     content: res.data.data.content,
        //     duration: 0,
        //   }
        //   : undefined,
        versions: [
          {
            id: assistantMessageId,
            // content: res.data.data.content,
            content: "",
            // content: "",
          },
        ],
      };

      // Add empty assistant message first
      setIsThinking(false)
      setMessages((prev) => [...prev, assistantMessage]);

      // Stream or set content
      // await streamResponse(assistantMessageId, res.data.content);
      // now stream
      await streamResponse(
        assistantMessageId,
        res.data.data.content
      );
      setStatus("ready");

    } catch (error) {
      setStatus("error");
      toast.error("Failed to get response");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus("submitted");
    // addUserMessage(suggestion);
  };

  const streamResponse = async (messageId: string, content: string) => {
    setStatus("streaming");

    const words = content.split(" ");
    let current = "";

    for (let i = 0; i < words.length; i++) {
      current += (i ? " " : "") + words[i];

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.key === messageId) {
            return {
              ...msg,
              versions: msg.versions.map((v) =>
                v.id === messageId ? { ...v, content: current } : v
              ),
            };
          }
          return msg;
        })
      );

      await new Promise((r) => setTimeout(r, 40)); // speed control
    }

    setStatus("ready");
  };

  // if (window !== undefined) {
  //   console.log("messages --", messages)
  //   // sessionStorage.setItem("chatHistory", JSON.stringify(messages))
  // }
  return (
    <div className="flex">
      <div className=" w-fit" >
        <SidebarDemo
          newChat={createNewChat}
          batches={batches}
          currentBatchId={currentBatchId}
          switchChat={switchChat}
          deleteChat={deleteChat}
        />
      </div>
      <div className="relative max-w-[80%] lg:px-16 xl:px-20 h-screen mx-auto flex size-full flex-col divide-y overflow-y-auto no-scrollbar">
        <Conversation className=" w-full mx-auto h-full overflow-y-auto no-scrollbar dark:text-gray-50!">
          <ConversationContent className=" no-scrollbar text-inherit ">
            {messages && messages.map(({ versions, ...message }) => (
              <MessageBranch defaultBranch={0} key={message.key}>
                <MessageBranchContent>
                  {versions.map((version) => (
                    <Message
                      from={message.from}
                      key={`${message.key}-${version.id}`}
                    >
                      <div>
                        {message.sources?.length && (
                          <Sources>
                            <SourcesTrigger count={message.sources.length} />
                            <SourcesContent>
                              {message.sources.map((source) => (
                                <Source
                                  href={source.href}
                                  key={source.href}
                                  title={source.title}
                                />
                              ))}
                            </SourcesContent>
                          </Sources>
                        )}
                        {message.reasoning && (
                          <Reasoning duration={message.reasoning.duration}>
                            <ReasoningTrigger />
                            <ReasoningContent>
                              {message.reasoning.content}
                            </ReasoningContent>
                          </Reasoning>
                        )}
                        <MessageContent className="dark:text-(--shiki-dark)!">
                          <MessageResponse>{version.content}</MessageResponse>
                        </MessageContent>
                      </div>
                    </Message>
                  ))}
                </MessageBranchContent>
                {versions.length > 1 && (
                  <MessageBranchSelector from={message.from}>
                    <MessageBranchPrevious />
                    <MessageBranchPage />
                    <MessageBranchNext />
                  </MessageBranchSelector>
                )}
              </MessageBranch>
            ))}

            {/* thinking  */}
            {isThinking && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>Thinking</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="  w-full mx-auto sticky bottom-0 grid shrink-0 gap-4 pt-4">
          {/* <Suggestions className="px-4">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              suggestion={suggestion}
            />
          ))}
        </Suggestions> */}
          <div className=" w-full px-4 pb-4">
            <PromptInput globalDrop multiple onSubmit={handleSubmit}>
              <PromptInputHeader>
                <PromptInputAttachmentsDisplay />
              </PromptInputHeader>
              <PromptInputBody className="flex justify-between w-full max-w-[990px] pr-4">
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                />
                <PromptInputSubmit
                  disabled={!(text.trim() || status) || status === "streaming"}
                  status={status}
                />
              </PromptInputBody>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
