"use strict";
// =============================================================================
// SERVIDOR PRINCIPAL - SWIFT CLINIC API
// =============================================================================
// 
// Servidor Express com configurações de segurança, performance e monitoramento
// Implementa rate limiting, compressão, CORS e WebSocket
//
// =============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const environment_1 = __importDefault(require("./config/environment"));
const database_1 = __importDefault(require("./config/database"));
const websocket_service_1 = require("./services/websocket.service");
// Middlewares
const responseHandler_1 = require("./middleware/responseHandler");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const injectTenant_1 = require("./middleware/injectTenant");
// Rotas
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/clinica/routes"));
const especialidade_routes_1 = __importDefault(require("./routes/especialidade.routes"));
const profissional_routes_1 = __importDefault(require("./routes/profissional.routes"));
const paciente_routes_1 = __importDefault(require("./routes/paciente.routes"));
const agendamento_routes_1 = __importDefault(require("./routes/agendamento.routes"));
const prontuario_routes_1 = __importDefault(require("./routes/prontuario.routes"));
const anamnese_routes_1 = __importDefault(require("./routes/anamnese.routes"));
const exame_routes_1 = __importDefault(require("./routes/exame.routes"));
const mensagem_routes_1 = __importDefault(require("./routes/mensagem.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const relatorio_routes_1 = __importDefault(require("./routes/relatorio.routes"));
const faturamento_routes_1 = __importDefault(require("./routes/faturamento.routes"));
const pagamento_routes_1 = __importDefault(require("./routes/pagamento.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const super_admin_routes_1 = __importDefault(require("./routes/super-admin.routes"));
const lembrete_routes_1 = __importDefault(require("./routes/lembrete.routes"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// =============================================================================
// CONFIGURAÇÕES DE SEGURANÇA E PERFORMANCE
// =============================================================================
// Helmet para segurança
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// CORS
app.use((0, cors_1.default)({
    origin: environment_1.default.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-tenant-id'],
}));
// Compressão para melhorar performance
app.use((0, compression_1.default)({
    level: 6, // Nível de compressão (0-9)
    threshold: 1024, // Tamanho mínimo para compressão
    filter: (req, res) => {
        // Não comprimir se o cliente não suporta
        if (req.headers['x-no-compression']) {
            return false;
        }
        // Comprimir apenas respostas JSON, HTML e texto
        return compression_1.default.filter(req, res);
    },
}));
// Rate limiting
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.default.rateLimit.windowMs,
    max: Math.floor(environment_1.default.rateLimit.maxRequests * 0.5), // Mais restritivo para auth
    message: {
        success: false,
        message: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const criticalApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.default.rateLimit.windowMs,
    max: environment_1.default.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Muitas requisições. Tente novamente em alguns minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.default.rateLimit.windowMs,
    max: environment_1.default.rateLimit.maxRequests * 2, // Mais permissivo para APIs gerais
    message: {
        success: false,
        message: 'Muitas requisições. Tente novamente em alguns minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Aplicar rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/dashboard', criticalApiLimiter);
app.use('/api/chat', criticalApiLimiter);
app.use('/api', generalLimiter);
// Parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Logging otimizado para performance
if (process.env.NODE_ENV === 'production') {
    app.use((0, morgan_1.default)('combined', {
        skip: (req, res) => res.statusCode < 400, // Log apenas erros em produção
    }));
}
else {
    app.use((0, morgan_1.default)('dev'));
}
// Middleware para padronizar respostas
app.use(responseHandler_1.responseHandler);
// Inicializa o WebSocket
const wsService = new websocket_service_1.WebSocketService(httpServer);
// =============================================================================
// ROTAS DE HEALTH CHECK E MONITORAMENTO
// =============================================================================
// Health check básico
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Swift Clinic API v3.0 Multitenant está funcionando!',
        timestamp: new Date().toISOString(),
        version: '3.0.0',
        environment: environment_1.default.server.nodeEnv,
    });
});
// Health check detalhado com métricas de performance
app.get('/health/detailed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    try {
        // Verificar conexão com banco
        const dbStartTime = Date.now();
        yield database_1.default.$queryRaw `SELECT 1`;
        const dbResponseTime = Date.now() - dbStartTime;
        // Verificar memória
        const memoryUsage = process.memoryUsage();
        const memoryMB = {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024),
        };
        const totalTime = Date.now() - startTime;
        res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            performance: {
                totalTime,
                database: dbResponseTime,
                memory: memoryMB,
            },
            services: {
                database: 'healthy',
                websocket: wsService.isConnected() ? 'connected' : 'disconnected',
            },
            version: '3.0.0',
            environment: environment_1.default.server.nodeEnv,
        });
    }
    catch (error) {
        const totalTime = Date.now() - startTime;
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString(),
            performance: {
                totalTime,
            },
        });
    }
}));
// Rota raiz
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bem-vindo à Swift Clinic API v3.0 Multitenant',
        timestamp: new Date().toISOString(),
        version: '3.0.0',
        documentation: '/api/docs',
        health: '/health',
        environment: environment_1.default.server.nodeEnv,
    });
});
// =============================================================================
// ROTAS DA API
// =============================================================================
// Rotas de autenticação (não precisam de middleware de tenant)
app.use('/api/auth', routes_1.default);
// Middleware de tenant para todas as outras rotas da API
app.use('/api', injectTenant_1.TenantMiddleware.injectTenant);
// Rotas da API que precisam de autenticação
app.use('/api/clinicas', routes_2.default);
app.use('/api/especialidades', especialidade_routes_1.default);
app.use('/api/profissionais', profissional_routes_1.default);
app.use('/api/pacientes', paciente_routes_1.default);
app.use('/api/agendamentos', agendamento_routes_1.default);
app.use('/api/prontuarios', prontuario_routes_1.default);
app.use('/api/anamneses', anamnese_routes_1.default);
app.use('/api/exames', exame_routes_1.default);
app.use('/api/mensagens', mensagem_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/relatorios', relatorio_routes_1.default);
app.use('/api/faturamento', faturamento_routes_1.default);
app.use('/api/pagamentos', pagamento_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/super-admin', super_admin_routes_1.default);
app.use('/api/lembretes', lembrete_routes_1.default);
// =============================================================================
// MIDDLEWARE DE ERRO
// =============================================================================
app.use(errorHandler_1.default.handleError);
// =============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================================================
// Função para inicializar o servidor
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Conecta ao banco de dados
            yield database_1.default.$connect();
            const PORT = environment_1.default.server.port;
            const NODE_ENV = environment_1.default.server.nodeEnv;
            httpServer.listen(PORT, () => {
                console.log('🚀 Swift Clinic API v3.0 Multitenant iniciada com sucesso!');
                console.log(`📍 Servidor rodando na porta: ${PORT}`);
                console.log(`🌍 Ambiente: ${NODE_ENV}`);
                console.log(`🔗 URL: http://localhost:${PORT}`);
                console.log(`📊 Health Check: http://localhost:${PORT}/health`);
                console.log(`📊 Health Detalhado: http://localhost:${PORT}/health/detailed`);
                console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
                console.log(`⚡ Rate Limiting: ${environment_1.default.rateLimit.maxRequests} req/${environment_1.default.rateLimit.windowMs / 1000}s`);
                console.log(`🗜️ Compressão: Habilitada (nível 6)`);
                console.log('✅ Sistema pronto para receber requisições!');
            });
            // Tratamento de sinais para graceful shutdown
            process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
                console.log('🛑 Recebido SIGTERM, encerrando servidor...');
                yield gracefulShutdown();
            }));
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                console.log('🛑 Recebido SIGINT, encerrando servidor...');
                yield gracefulShutdown();
            }));
        }
        catch (error) {
            console.error('❌ Erro ao inicializar servidor:', error);
            process.exit(1);
        }
    });
}
// Função para graceful shutdown
function gracefulShutdown() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔄 Encerrando conexões...');
            // Fecha o servidor HTTP
            httpServer.close(() => {
                console.log('✅ Servidor HTTP encerrado');
            });
            // Desconecta do banco de dados
            yield database_1.default.$disconnect();
            console.log('✅ Conexão com banco de dados encerrada');
            console.log('👋 Servidor encerrado com sucesso!');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Erro durante graceful shutdown:', error);
            process.exit(1);
        }
    });
}
// Inicia o servidor
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map