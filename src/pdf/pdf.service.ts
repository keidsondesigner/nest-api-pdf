import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdf } from './entities/pdf.entity';
import { existsSync, mkdirSync } from 'fs';
import { join, parse } from 'path';
import { PDFNet } from '@pdftron/pdfnet-node';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Pdf)
    private readonly pdfRepository: Repository<Pdf>,
  ) {}

  async create(file: Express.Multer.File): Promise<Pdf> {
    const pdf = new Pdf();
    pdf.filename = file.filename;
    pdf.originalname = file.originalname;
    pdf.mimetype = file.mimetype;
    pdf.size = file.size;
    pdf.path = file.path;
    
    // Gerar thumbnail para o PDF
    try {
      const thumbnailPath = await this.generateThumbnail(file.path, file.filename);
      pdf.thumbnailPath = thumbnailPath;
    } catch (error) {
      console.error('Erro ao gerar thumbnail:', error);
      // Continua mesmo se falhar a geração do thumbnail
    }

    return this.pdfRepository.save(pdf);
  }

  async findAll(): Promise<Pdf[]> {
    return this.pdfRepository.find();
  }

  async findOne(id: number): Promise<Pdf> {
    const pdf = await this.pdfRepository.findOne({ where: { id } });
    if (!pdf) {
      throw new NotFoundException(`PDF com ID ${id} não encontrado`);
    }
    return pdf;
  }

  async remove(id: number): Promise<void> {
    const result = await this.pdfRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PDF com ID ${id} não encontrado`);
    }
  }

  /**
   * Gera ou regenera o thumbnail para um PDF existente
   * @param id ID do PDF
   * @returns PDF atualizado com o caminho do thumbnail
   */
  async generateThumbnailForExistingPdf(id: number): Promise<Pdf> {
    const pdf = await this.findOne(id);
    
    try {
      const thumbnailPath = await this.generateThumbnail(pdf.path, pdf.filename);
      pdf.thumbnailPath = thumbnailPath;
      return this.pdfRepository.save(pdf);
    } catch (error) {
      console.error(`Erro ao gerar thumbnail para o PDF ${id}:`, error);
      throw new Error(`Não foi possível gerar o thumbnail para o PDF ${id}: ${error.message}`);
    }
  }

  /**
   * Gera um thumbnail para o arquivo PDF
   * @param inputPath Caminho do arquivo PDF
   * @param filename Nome do arquivo PDF
   * @returns Caminho do thumbnail gerado
   */
  private async generateThumbnail(inputPath: string, filename: string): Promise<string> {
    // Certifique-se de que o diretório de thumbnails existe
    const thumbnailDir = './uploads/thumbnails';
    if (!existsSync(thumbnailDir)) {
      mkdirSync(thumbnailDir, { recursive: true });
    }
    
    const outputPath = join(thumbnailDir, `${filename}.png`);
    const relativeOutputPath = join('uploads/thumbnails', `${filename}.png`);
    
    try {
      // Inicializa o PDFNet com a chave de licença
      // Importante: Não inicialize o PDFNet se já estiver inicializado
      try {
        await PDFNet.initialize('demo:1749392739433:61caf6de0300000000f9fb759129005e6e760957a9889da9fdc75b85b5');
      } catch (initError) {
        // Se já estiver inicializado, ignora o erro
        console.log('PDFNet já inicializado ou erro ao inicializar:', initError.message);
      }
      
      // Usa runWithCleanup que gerencia melhor o ciclo de vida do PDFNet
      await PDFNet.runWithCleanup(async () => {
        const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
        await doc.initSecurityHandler();
        const pdfdraw = await PDFNet.PDFDraw.create(92); // Resolução do thumbnail
        const currPage = await doc.getPage(1); // Primeira página
        await pdfdraw.export(currPage, outputPath, 'PNG');
      });
      
      return relativeOutputPath;
    } catch (error) {
      console.error('Erro ao gerar thumbnail:', error);
      throw error;
    }
  }
}
