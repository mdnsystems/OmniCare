"use strict";
// =============================================================================
// CONFIGURAÇÃO DE AMBIENTE - SWIFT CLINIC API
// =============================================================================
// 
// Centraliza todas as configurações do sistema
// Valida variáveis de ambiente obrigatórias
//
// =============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
// Validação rigorosa de variáveis de ambiente obrigatórias
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variável de ambiente ${envVar} é obrigatória`);
    }
}
// Validação de secrets JWT
const validateJwtSecrets = () => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (jwtSecret.length < 32) {
        throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres');
    }
    if (jwtRefreshSecret.length < 32) {
        throw new Error('JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres');
    }
    // Verificar se não são secrets padrão
    const defaultSecrets = [
        'swift-clinic-secret-key-2024',
        'swift-clinic-refresh-secret-2024',
        'default-secret',
        'secret',
        'key'
    ];
    if (defaultSecrets.includes(jwtSecret) || defaultSecrets.includes(jwtRefreshSecret)) {
        throw new Error('JWT_SECRET e JWT_REFRESH_SECRET devem ser valores únicos e seguros');
    }
};
validateJwtSecrets();
// Configuração de rate limiting baseada no ambiente
const getRateLimitConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        return {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minuto
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requisições por minuto
            skipSuccessfulRequests: false,
            skipFailedRequests: false,
        };
    }
    // Desenvolvimento - mais permissivo mas ainda seguro
    return {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minuto
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '500', 10), // 500 requisições por minuto
        skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true',
        skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED_REQUESTS === 'true',
    };
};
const config = {
    server: {
        port: parseInt(process.env.PORT || '8080', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        host: process.env.HOST || 'localhost',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    cors: {
        allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    },
    rateLimit: getRateLimitConfig(),
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
        passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
        passwordRequireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
        passwordRequireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
        passwordRequireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
        passwordRequireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true',
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
    },
    whatsapp: {
        zApiUrl: process.env.ZAPI_URL || 'https://api.z-api.io',
        defaultInstanceId: process.env.ZAPI_DEFAULT_INSTANCE_ID || '',
    },
};
exports.default = config;
//# sourceMappingURL=environment.js.map