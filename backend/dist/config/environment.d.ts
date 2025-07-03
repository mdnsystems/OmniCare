interface Config {
    server: {
        port: number;
        nodeEnv: string;
        host: string;
    };
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        allowedOrigins: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
        skipSuccessfulRequests: boolean;
        skipFailedRequests: boolean;
    };
    security: {
        bcryptRounds: number;
        passwordMinLength: number;
        passwordRequireUppercase: boolean;
        passwordRequireLowercase: boolean;
        passwordRequireNumbers: boolean;
        passwordRequireSpecialChars: boolean;
    };
    email: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
    };
    whatsapp: {
        zApiUrl: string;
        defaultInstanceId: string;
    };
}
declare const config: Config;
export default config;
