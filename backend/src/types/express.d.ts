import { JwtPayload } from './enums';

// Extensão das interfaces do Express
declare module 'express' {
  interface Request {
    tenantId?: string;
    user?: JwtPayload;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}

// Declaração global para NextFunction
declare global {
  namespace Express {
    interface NextFunction {
      (err?: any): void;
    }
  }
}

export {}; 