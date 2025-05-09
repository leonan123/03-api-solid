import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(req.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.handle({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
