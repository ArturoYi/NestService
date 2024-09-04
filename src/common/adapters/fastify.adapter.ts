import { FastifyAdapter } from '@nestjs/platform-fastify'
import FastifyMultipart from '@fastify/multipart'
const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
})
app.register(FastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6, // limit size 6M
    files: 5, // Max number of file fields
  },
})
app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const { origin } = request.headers
  if (!origin) request.headers.origin = request.headers.host

  // forbidden php

  const { url } = request

  if (url.endsWith('.php')) {
    reply.raw.statusMessage =
      'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.'

    return reply.code(418).send()
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) return reply.code(204).send()

  done()
})
export { app as fastifyApp }
