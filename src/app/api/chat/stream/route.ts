import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "~/server/auth";
import { LangChainAdapter } from "ai";
import { createRagChain } from "~/lib/rag";

export async function POST(req: NextRequest) {
  try {
    // Get user session
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Parse request body
    const { messages, projectId } = await req.json();

    const query = messages[messages.length - 1].content;

    // Create RAG system
    // const ragSystem = await createChatRagSystem(projectId);

    const streamResponse = (await createRagChain(projectId)).stream({
      question: query,
      // chat_history: [],
    });

    return LangChainAdapter.toDataStreamResponse(await streamResponse);
  } catch (error) {
    console.error("Error in chat stream route:", error);
    return NextResponse.json(
      { error: "Failed to process streaming request" },
      { status: 500 },
    );
  }
}
