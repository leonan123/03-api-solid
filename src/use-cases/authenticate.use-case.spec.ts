import { hashSync } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'

import { AuthenticateUseCase } from './authenticate.use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: '2WlqI@example.com',
      password_hash: hashSync('123456', 6),
    })

    const { user } = await sut.handle({
      email: '2WlqI@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    await expect(() =>
      sut.handle({
        email: '2WlqI@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: '2WlqI@example.com',
      password_hash: hashSync('123456', 6),
    })

    const wrongPassword = 'wrong-password'

    await expect(() =>
      sut.handle({
        email: '2WlqI@example.com',
        password: wrongPassword,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
