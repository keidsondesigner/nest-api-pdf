import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { PdfService } from './pdf.service';
import { multerConfig } from './multer.config';
import { IPdf } from './interfaces/pdf.interface';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<{
    message: string;
    pdfs: IPdf[];
  }> {
    if (!files || files.length === 0) {
      throw new HttpException(
        'Nenhum arquivo PDF enviado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const results: IPdf[] = [];
    for (const file of files) {
      const pdf = await this.pdfService.create(file);
      results.push(pdf);
    }

    return {
      message: `${files.length} arquivo(s) PDF enviado(s) com sucesso`,
      pdfs: results,
    };
  }

  @Get()
  async findAll(): Promise<IPdf[]> {
    return this.pdfService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.findOne(id);

    // Verifica se o arquivo existe no sistema de arquivos
    if (!existsSync(pdf.path)) {
      throw new HttpException(
        'Arquivo PDF não encontrado no servidor',
        HttpStatus.NOT_FOUND,
      );
    }

    // Configura os headers para download do arquivo
    res.setHeader('Content-Type', pdf.mimetype);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${pdf.originalname}"`,
    );

    // Envia o arquivo como stream
    const fileStream = createReadStream(join(process.cwd(), pdf.path));
    fileStream.pipe(res);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.pdfService.remove(id);
    return { message: `PDF com ID ${id} removido com sucesso` };
  }
}
