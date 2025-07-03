import { Request, Response, NextFunction } from 'express';
export declare const responseHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const createErrorResponse: (statusCode: number, message: string, error?: any) => {
    success: boolean;
    error: string;
    details: any;
    timestamp: string;
};
export declare const createSuccessResponse: (data: any) => {
    success: boolean;
    data: any;
    timestamp: string;
};
