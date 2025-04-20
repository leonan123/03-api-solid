import { hashSync } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users.repository'

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
      throw new Error('E-mail already exists.')
    }

    const password_hash = hashSync(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
