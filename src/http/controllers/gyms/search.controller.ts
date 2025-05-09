import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gym-use-case'

export async function search(req: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number(),
  })

  const { q, page } = searchGymQuerySchema.parse(req.query)

  const searchGymUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymUseCase.handle({
    query: q,
    page,
  })

  return reply.status(200).send({ gyms })
}
