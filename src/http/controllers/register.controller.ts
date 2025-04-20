import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/email-already-exists.error'
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
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
