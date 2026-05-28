import { BadGatewayException } from "@nestjs/common";
import ollama from "ollama";

export default async function answerWithLLM(question: string, context: string) {
  try {

    const response = await ollama.chat({
      model: 'qwen2.5:1.5b',
      messages: [
        {
          role: 'user',
          content: `You are a helpful assistant. Answer the following question based on the context provided.

Question: ${question}

Context:
${context}

Answer:`,
        },
      ],
    });
    return response.message.content;
  } catch (error) {
    throw new BadGatewayException(error);
  }
}