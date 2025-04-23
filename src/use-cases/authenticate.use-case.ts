import { compareSync } from 'bcryptjs'
import type { User } from 'generated/prisma'

import type { UsersRepository } from '@/repositories/users.repository'

import { InvalidCredentialsError } from './errors/invalid-credentials.error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async handle({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)
    const doesPasswordMatch = user && compareSync(password, user.password_hash)

    if (!user || !doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
