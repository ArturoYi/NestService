"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fastify_adapter_1 = require("./common/adapters/fastify.adapter");
const env_1 = require("./global/env");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const class_validator_1 = require("class-validator");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const setup_swagger_1 = require("./setup-swagger");
const socket_adapter_1 = require("./common/adapters/socket.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastify_adapter_1.fastifyApp, {
        bufferLogs: true,
        snapshot: true,
    });
    const configService = app.get((config_1.ConfigService));
    const { port, globalPrefix } = configService.get('app', { infer: true });
    app.enableCors({ origin: '*', credentials: true });
    app.setGlobalPrefix(globalPrefix);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.useStaticAssets({ root: path_1.default.join(__dirname, '..', 'public') });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
        stopAtFirstError: true,
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: (errors) => new common_1.UnprocessableEntityException(errors.map((e) => {
            const rule = Object.keys(e.constraints)[0];
            const msg = e.constraints[rule];
            return msg;
        })[0]),
    }));
    app.useWebSocketAdapter(new socket_adapter_1.RedisIoAdapter(app));
    if (!env_1.isDev)
        app.enableShutdownHooks();
    if (env_1.isDev)
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    (0, setup_swagger_1.setupSwagger)(app, configService);
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map