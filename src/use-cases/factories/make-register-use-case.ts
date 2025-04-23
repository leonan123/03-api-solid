import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository'

import { RegisterUseCase } from '../register.use-case'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
