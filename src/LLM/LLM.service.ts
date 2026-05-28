import { Injectable } from "@nestjs/common";
import { OpenRouter } from "@openrouter/sdk";
import modelsConstants from "src/constants/model.constants";

@Injectable()
export default class LLMService {
  private openRouterClient: OpenRouter
  constructor() {
    this.openRouterClient = new OpenRouter({
      apiKey: process.env.OPEN_ROUTER
    })
  }

  async openRouterChat(question: string, context: string) {
    const completion = await this.openRouterClient.chat.send({


      chatRequest: {
        stream: false,
        models: modelsConstants,

        messages: [
          {
            role: 'user',
            content: `
You are an HOA AI assistant.

Your task is to answer the user's question ONLY using the provided context.

Rules:
- Use only the information from the context.
- Do NOT make up information.
- Do NOT use outside knowledge.
- If the answer is not found in the context, say:
  "I could not find the answer in the provided document."
- Keep the answer clear and concise.
- If possible, mention important rules, dates, fees, or limits exactly as written in the context.

Context:
${context}

Question:
${question}

Answer:

            `,

          },

        ]
      }

    })

    return completion.choices[0].message.content

  }

  async generateQuestionWithLastConversation(conversations: string, lastQuestion: string) {
    const completion = await this.openRouterClient.chat.send({


      chatRequest: {
        stream: false,
        models: modelsConstants,

        messages: [
          {
            role: 'system',
            content: `
            You are an AI assistant that rewrites follow-up questions into standalone search queries.

Your task:
- Understand the previous conversation.
- Rewrite the current question so it can be understood independently.
- Preserve the original meaning.
- Keep the rewritten question short and clear.
- Do NOT answer the question.
- Do NOT add extra explanations.
- Return ONLY the rewritten standalone question.

Conversation History:
${conversations}

Current Question:
${lastQuestion}

Standalone Question:


            `,

          },

        ]
      }

    })

    return completion.choices[0].message.content
  }
}