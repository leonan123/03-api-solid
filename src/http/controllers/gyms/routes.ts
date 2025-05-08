import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create.controller'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', create)
}
