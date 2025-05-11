import type { FastifyInstance } from 'fastify'

import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create.controller'
import { history } from './history.controller'
import { metrics } from './metrics.controller'
import { validate } from './validate.controller'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )

  app.post('/gyms/:gymId/check-in', create)
}
