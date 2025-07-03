// =============================================================================
// SERVIDOR PRINCIPAL - SWIFT CLINIC API
// =============================================================================
// 
// Servidor Express com configurações de segurança, performance e monitoramento
// Implementa rate limiting, compressão, CORS e WebSocket
//
// =============================================================================

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import config from './config/environment';
import prisma from './config/database';
import { WebSocketService } from './services/websocket.service';

// Middlewares
import { responseHandler } from './middleware/responseHandler';
import ErrorHandler from './middleware/errorHandler';
import { TenantMiddleware } from './middleware/injectTenant';

// Rotas
import authRoutes from './modules/auth/routes';
import clinicaRoutes from './modules/clinica/routes';
import especialidadeRoutes from './routes/especialidade.routes';
import profissionalRoutes from './routes/profissional.routes';
import pacienteRoutes from './routes/paciente.routes';
import agendamentoRoutes from './routes/agendamento.routes';
import prontuarioRoutes from './routes/prontuario.routes';
import anamneseRoutes from './routes/anamnese.routes';
import exameRoutes from './routes/exame.routes';
import mensagemRoutes from './routes/mensagem.routes';
import chatRoutes from './routes/chat.routes';
import usuarioRoutes from './routes/usuario.routes';
import relatorioRoutes from './routes/relatorio.routes';
import faturamentoRoutes from './routes/faturamento.routes';
import pagamentoRoutes from './routes/pagamento.routes';
import dashboardRoutes from './routes/dashboard.routes';
import superAdminRoutes from './routes/super-admin.routes';
import lembreteRoutes from './routes/lembrete.routes';

const app = express();
const httpServer = http.createServer(app);

// =============================================================================
// CONFIGURAÇÕES DE SEGURANÇA E PERFORMANCE
// =============================================================================

// Helmet para segurança
app.use(helmet({
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
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-tenant-id'],
}));

// Compressão para melhorar performance
app.use(compression({
  level: 6, // Nível de compressão (0-9)
  threshold: 1024, // Tamanho mínimo para compressão
  filter: (req, res) => {
    // Não comprimir se o cliente não suporta
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Comprimir apenas respostas JSON, HTML e texto
    return compression.filter(req, res);
  },
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: Math.floor(config.rateLimit.maxRequests * 0.5), // Mais restritivo para auth
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const criticalApiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests * 2, // Mais permissivo para APIs gerais
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging otimizado para performance
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400, // Log apenas erros em produção
  }));
} else {
  app.use(morgan('dev'));
}

// Middleware para padronizar respostas
app.use(responseHandler);

// Inicializa o WebSocket
const wsService = new WebSocketService(httpServer);

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
    environment: config.server.nodeEnv,
  });
});

// Health check detalhado com métricas de performance
app.get('/health/detailed', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Verificar conexão com banco
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
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
      environment: config.server.nodeEnv,
    });
  } catch (error: any) {
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
});

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à Swift Clinic API v3.0 Multitenant',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    documentation: '/api/docs',
    health: '/health',
    environment: config.server.nodeEnv,
  });
});

// =============================================================================
// ROTAS DA API
// =============================================================================

// Rotas de autenticação (não precisam de middleware de tenant)
app.use('/api/auth', authRoutes);

// Middleware de tenant para todas as outras rotas da API
app.use('/api', TenantMiddleware.injectTenant);

// Rotas da API que precisam de autenticação
app.use('/api/clinicas', clinicaRoutes);
app.use('/api/especialidades', especialidadeRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/prontuarios', prontuarioRoutes);
app.use('/api/anamneses', anamneseRoutes);
app.use('/api/exames', exameRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/faturamento', faturamentoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/lembretes', lembreteRoutes);

// =============================================================================
// MIDDLEWARE DE ERRO
// =============================================================================

app.use(ErrorHandler.handleError);

// =============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================================================

// Função para inicializar o servidor
async function startServer() {
  try {
    // Conecta ao banco de dados
    await prisma.$connect();

    const PORT = config.server.port;
    const NODE_ENV = config.server.nodeEnv;

    httpServer.listen(PORT, () => {
      console.log('🚀 Swift Clinic API v3.0 Multitenant iniciada com sucesso!');
      console.log(`📍 Servidor rodando na porta: ${PORT}`);
      console.log(`🌍 Ambiente: ${NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📊 Health Detalhado: http://localhost:${PORT}/health/detailed`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
      console.log(`⚡ Rate Limiting: ${config.rateLimit.maxRequests} req/${config.rateLimit.windowMs/1000}s`);
      console.log(`🗜️ Compressão: Habilitada (nível 6)`);
      console.log('✅ Sistema pronto para receber requisições!');
    });

    // Tratamento de sinais para graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 Recebido SIGTERM, encerrando servidor...');
      await gracefulShutdown();
    });

    process.on('SIGINT', async () => {
      console.log('🛑 Recebido SIGINT, encerrando servidor...');
      await gracefulShutdown();
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Função para graceful shutdown
async function gracefulShutdown() {
  try {
    console.log('🔄 Encerrando conexões...');
    
    // Fecha o servidor HTTP
    httpServer.close(() => {
      console.log('✅ Servidor HTTP encerrado');
    });

    // Desconecta do banco de dados
    await prisma.$disconnect();
    console.log('✅ Conexão com banco de dados encerrada');

    console.log('👋 Servidor encerrado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante graceful shutdown:', error);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();

export default app;
