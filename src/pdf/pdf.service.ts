import {
  BadGatewayException,
  BadRequestException,
  Delete,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { SmartPDFParser } from 'pdf-parse-new';
import { Document, DocumentSchema } from 'src/schemas/document.schema';
import ollama from 'ollama';
import { Chunk } from 'src/schemas/chunk.schema';
import { CustomTimer } from 'src/Helpers/timer';
import chunkText from 'src/Helpers/generateChunk';
import generateEmbedding from 'src/Helpers/generateEmbbeding';
import cosineSimilarity from 'src/Helpers/cosineSimilarity';
import answerWithLLM from 'src/Helpers/answerWithLLm';
import LLMService from 'src/LLM/LLM.service';
import { OpenRouter } from '@openrouter/sdk';
import { ChatHistory } from 'src/schemas/chatHistory.schema';
@Injectable()
export class PdfService {
  constructor(
    @InjectModel(Document.name) private DocumentModel: Model<Document>,
    @InjectModel(Chunk.name) private ChunkModel: Model<Chunk>,
    @InjectModel(ChatHistory.name) private ChatHistoryModel: Model<ChatHistory>,
    private readonly llmService: LLMService
  ) {
    const timer = new CustomTimer();
  }
  async getHello() {
    const openRouter = new OpenRouter({
      apiKey: process.env.OPEN_ROUTER
    })
    const models: any = await openRouter.models.list()
    const filterModels = models.data.filter((model: any) => {
      return model.id.includes('free')
    })
    return filterModels;
  }


  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file not found');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('file must be pdf');
    }
    try {
      const parser = new SmartPDFParser();
      const parsed = await parser.parse(file.buffer);
      const chunks = chunkText(parsed.text);
      const createDocument = await this.DocumentModel.create({
        fileName: file?.originalname,
        originalName: file?.originalname,
        size: file?.size,
        pages: parsed?.numpages,
        status: 'pending',
      });

      if (!createDocument) {
        throw new BadGatewayException('error creating document');
      }
      const chunkPromises = chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk);

        const createChunk = await this.ChunkModel.create({
          documentId: createDocument._id,
          embeddingModel: 'nomic-embed-text-v2-moe',
          text: chunk,
          page: index + 1,
          embedding: embedding as number[],
        });
        if (!createChunk) {
          throw new BadGatewayException('error creating chunk');
        }
      });

      await Promise.all(chunkPromises);

      return {
        message: 'file uploaded successfully',
        status: 'done',
        filename: file?.originalname,
        size: file?.size,
        pages: parsed?.numpages,
        // test:chunks
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteAllForObjectId(id: string) {
    try {
      await this.ChunkModel.deleteMany({ documentId: id });
      await this.DocumentModel.findByIdAndDelete(id);
      await this.ChatHistoryModel.deleteMany({ documentId: id });
      return {
        message: 'All chunks deleted successfully',
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getAnswer(id: string, question: string) {
    let customQuestion = question;
    try {

      const timer = new CustomTimer();
      // hansi pdf oldugu tapilir.
      const document = await this.DocumentModel.findById(id);

      // uygun pdf yoxdursa error verir.
      if (!document) {
        throw new BadRequestException('document not found');
      }
      //pdf chunkslari tapilir. bu sonradan birbasa vector search olacaq.
      const chunks = await this.ChunkModel.find({ documentId: id });

      // chunklar yoxdursa error qaytarir
      if (!chunks) {
        throw new BadRequestException('chunks not found');
      }

      //!  burada eger conversation olubsa o conversationa uygun sual cavab melumatlarini basqa llm e gondereceyik. ve ona uygun sual yaradacaq. 
      //!  eger  ilk sualdirsasa  o zaman conversation yaradacayiq.
      const conversations = await this.ChatHistoryModel.find({ documentId: id });
      if (conversations.length > 0) {
        const topThreeConversation = conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 3);
        const generateConversation = topThreeConversation.map((conversation: ChatHistory, index: number) => {
          return {
            order: index + 1,
            question: conversation.question,
            answer: conversation.answer,
          }
        }).join("\n\n")
        console.log(generateConversation, "generateConversation")
        customQuestion = await this.llmService.generateQuestionWithLastConversation(generateConversation, question)
      }


      const questionEmbedding = await generateEmbedding(customQuestion);
      const scoredChunks: {
        chunk: Chunk;
        score: number;
      }[] = [];
      for (const chunk of chunks) {
        let score = cosineSimilarity(questionEmbedding, chunk.embedding);
        scoredChunks.push({
          chunk: chunk,
          score: score
        })

      }
      const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 5);
      const context = topChunks.map((chunk) => chunk.chunk.text).join('\n\n')



      const answerLLM = await this.llmService.openRouterChat(customQuestion, context)
      await this.ChatHistoryModel.create({
        documentId: id,
        question: customQuestion,
        answer: answerLLM,
        title: 'sual'

      })
      return {
        question: customQuestion,
        // context: context,
        answerLLM: answerLLM
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
