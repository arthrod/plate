import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({
  logger: true
});

const prisma = new PrismaClient();

fastify.get('/users', async (_request, _reply) => {
  const users = await prisma.user.findMany();
  return users;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
