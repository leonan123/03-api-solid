import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'

import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  // afterEach(() => vi.useRealTimers())

  it('should be able to validate check in', async () => {
    const { id: checkInId } = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.handle({
      checkInId: checkInId,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))

    const validatedCheckIn = await checkInsRepository.findById(checkIn.id)

    expect(validatedCheckIn?.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.handle({
        checkInId: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
