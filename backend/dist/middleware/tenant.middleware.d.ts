import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            tenantId?: string;
        }
    }
}
export declare const tenantMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const optionalTenantMiddleware: (req: Request, res: Response, next: NextFunction) => void;
