import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdf } from './entities/pdf.entity';

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
}
