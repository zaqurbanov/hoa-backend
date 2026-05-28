import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Get()
  async getHello(): Promise<any> {
    return this.pdfService.getHello();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.pdfService.uploadFile(file);
  }

  @Delete(':id/chunks')
  async deleteAllForObjectId(@Param('id') id: string) {
    return this.pdfService.deleteAllForObjectId(id);
  }

  @Post(':id/question')
  async getAnswer(@Param('id') id: string, @Body('question') question: string) {
    return this.pdfService.getAnswer(id, question);
  }
}
