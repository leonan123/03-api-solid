import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository'
import { RegisterUseCase } from '@/use-cases/register.use-case'

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    await registerUseCase.handle({ name, email, password })
  } catch {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
