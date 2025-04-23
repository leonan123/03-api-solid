import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository'

import { AuthenticateUseCase } from '../authenticate.use-case'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
