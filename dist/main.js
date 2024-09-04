"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fastify_adapter_1 = require("./common/adapters/fastify.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastify_adapter_1.fastifyApp, {
        bufferLogs: true,
        snapshot: true,
    });
    console.log(process.env.NODE_ENV);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map