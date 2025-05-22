import { useState, useCallback } from "react";
import { readStreamableValue } from "ai/rsc";
import { retrieveAnswer } from "~/app/chat/action";

export interface ChatMessage {
  content: string;
  role: "user" | "ai";
  id?: string;
}

export interface FileReference {
  fileName: string;
  summary: string;
  sourceCode: string;
}

export interface StreamingResponse {
  output: any;
  fileReferences: {
    fileName: string;
    summary: string;
    sourceCode: string;
  }[];
}

export interface Props {
  projectId: string;
  onError?: (error: Error) => void;
  onFileReferences?: (references: FileReference[]) => void;
}

export function useStreamingChat({ projectId, ...options }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<FileReference[]>([]);

  const addUserMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      content,
      role: "user",
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    return userMessage;
  }, []);

  const streamResponse = useCallback(
    async (streamingResponse: StreamingResponse) => {
      const { output, fileReferences: refs } = streamingResponse;

      setFileReferences(refs);
      options.onFileReferences?.(refs);

      const aiMessageId = Date.now().toString();
      const aiMessage: ChatMessage = {
        content: "",
        role: "ai",
        id: aiMessageId,
      };

      setMessages((prev) => [...prev, aiMessage]);

      try {
        for await (const delta of readStreamableValue(output)) {
          if (delta) {
            setMessages((prev) => {
              return prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + delta }
                  : msg,
              );
            });
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
        options.onError?.(
          error instanceof Error ? error : new Error("Streaming failed"),
        );

        setMessages((prev) => {
          return prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content:
                    "Sorry, an error occurred while processing your request.",
                }
              : msg,
          );
        });
      }
    },
    [options],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !projectId) return;

      setIsLoading(true);
      setFileReferences([]);

      try {
        // Add user message
        addUserMessage(message);

        // user query history
        const previousQueries = messages
          .filter((msg) => msg.role === "user")
          .map((msg) => msg.content);

        console.log("🚀 ~ previousQueries:", previousQueries);
        // Get streaming response
        const response = await retrieveAnswer(
          message,
          projectId,
          previousQueries,
        );

        // Stream the AI response
        await streamResponse(response);
      } catch (error) {
        console.error("Send message error:", error);
        options.onError?.(
          error instanceof Error ? error : new Error("Failed to send message"),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addUserMessage, streamResponse, options, projectId],
  );

  return {
    // State
    messages,
    isLoading,
    fileReferences,

    // Actions
    sendMessage,
    addUserMessage,

    // Direct streaming
    streamResponse,
  };
}
