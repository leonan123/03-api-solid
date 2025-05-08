import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { register } from './register.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
