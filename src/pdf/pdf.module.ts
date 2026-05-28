import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from 'src/schemas/document.schema';
import { Chunk, ChunkSchema } from 'src/schemas/chunk.schema';
import LLMService from 'src/LLM/LLM.service';
import { ChatHistory, ChatHistorySchema } from 'src/schemas/chatHistory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    MongooseModule.forFeature([{ name: Chunk.name, schema: ChunkSchema }]),
    MongooseModule.forFeature([{ name: ChatHistory.name, schema: ChatHistorySchema }]),
  ],
  controllers: [PdfController],
  providers: [PdfService, LLMService],
})
export class PdfModule { }
