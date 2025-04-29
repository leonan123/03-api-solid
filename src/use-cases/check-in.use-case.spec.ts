import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

import { CheckInUseCase } from './check-in.use-case'
import { MaxDistanceExceededError } from './errors/max-distance-exceeded.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -25.432421,
      longitude: -49.273789,
    })

    vi.useFakeTimers()
  })

  afterEach(() => vi.useRealTimers())

  it('should be able to check in', async () => {
    const { checkIn } = await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.432421,
      userLongitude: -49.273789,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.432421,
      userLongitude: -49.273789,
    })

    await expect(() =>
      sut.handle({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -25.432421,
        userLongitude: -49.273789,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.432421,
      userLongitude: -49.273789,
    })

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.432421,
      userLongitude: -49.273789,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-02',
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -25.432421,
      longitude: -49.273789,
    })

    await expect(() =>
      sut.handle({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceExceededError)
  })
})
