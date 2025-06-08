import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

// Certifique-se de que o diretório de uploads existe
const uploadDir = './uploads';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Definindo um tipo para o erro personalizado
class PdfValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfValidationError';
  }
}

export const multerConfig: multer.Options = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ): void => {
      // Gera um nome de arquivo único baseado no timestamp
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ): void => {
    // Aceita apenas arquivos PDF
    if (file.mimetype !== 'application/pdf') {
      const error = new PdfValidationError(
        'Apenas arquivos PDF são permitidos',
      );
      return callback(error);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 7 * 1024 * 1024, // Limite de 10MB por arquivo
  },
};
