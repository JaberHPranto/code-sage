"use client";

import { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import useProjects from "~/hooks/use-projects";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useStreamingChat } from "~/hooks/use-streaming-chat";

export default function SimpleChat() {
  const { selectedProjectId } = useProjects();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState("");

  const { messages, isLoading, fileReferences, sendMessage } = useStreamingChat(
    { projectId: selectedProjectId },
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    await sendMessage(question);
    setQuestion("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-3xl flex-col p-4">
      <h1 className="mb-4 text-2xl font-bold">Simple Code Chat</h1>

      {/* Messages container */}
      <ScrollArea className="mb-4 flex-1 overflow-auto rounded-md border p-4">
        {messages.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            Ask a question about your codebase
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-4">
                <div className="font-bold">
                  {message.role === "user" ? "You:" : "AI:"}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {message.role === "ai" ? (
                    <div data-color-mode="light">
                      <MDEditor.Markdown source={message.content} />
                    </div>
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your codebase..."
          disabled={isLoading}
          className="flex-1 rounded-md border p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-blue-300"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
