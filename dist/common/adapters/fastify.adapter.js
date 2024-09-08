"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyApp = void 0;
const platform_fastify_1 = require("@nestjs/platform-fastify");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const app = new platform_fastify_1.FastifyAdapter({
    trustProxy: true,
    logger: false,
});
exports.fastifyApp = app;
app.register(multipart_1.default, {
    limits: {
        fields: 10,
        fileSize: 1024 * 1024 * 6,
        files: 5,
    },
});
app.getInstance().addHook('onRequest', (request, reply, done) => {
    const { origin } = request.headers;
    if (!origin)
        request.headers.origin = request.headers.host;
    const { url } = request;
    if (url.endsWith('.php')) {
        reply.raw.statusMessage =
            'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.';
        return reply.code(418).send();
    }
    if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
        return reply.code(204).send();
    done();
});
//# sourceMappingURL=fastify.adapter.js.map