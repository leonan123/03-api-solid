import { hashSync } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users.repository'

import { UserAlreadyExistsError } from './errors/email-already-exists.error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async handle({ name, email, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = hashSync(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
