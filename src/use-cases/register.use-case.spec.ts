import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register.use-case'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUserUseCase = new RegisterUseCase({
      async findByEmail(_email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

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
})
