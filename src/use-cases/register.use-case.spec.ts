import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'

import { UserAlreadyExistsError } from './errors/email-already-exists.error'
import { RegisterUseCase } from './register.use-case'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserUseCase.handle({
      name: 'John Doe',
      email: '2WlqI@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserUseCase.handle({
      name: 'John Doe',
      email: '2WlqI@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should throw if email is already taken', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUseCase(usersRepository)

    const email = '2WlqI@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: '123456',
    })

    await expect(() =>
      registerUserUseCase.handle({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
