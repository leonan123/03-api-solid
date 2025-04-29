import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

import { CreateGymUseCase } from './create-gym.use-case'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.handle({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -25.432421,
      longitude: -49.273789,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
