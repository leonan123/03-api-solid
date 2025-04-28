import type { CheckIn } from 'generated/prisma'

import type { CheckInsRepository } from '@/repositories/check-ins.repository'
import type { GymsRepository } from '@/repositories/gyms.repository'
import {
  type Coordinates,
  getDistanceBetweenCoordinates,
} from '@/utils/get-distance-between-coordinates'

import { MaxDistanceExceededError } from './errors/max-distance-exceeded.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async handle({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const userCoordinates: Coordinates = {
      latitude: userLatitude,
      longitude: userLongitude,
    }

    const gymCoordinates: Coordinates = {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }

    const distanceInKilometers = getDistanceBetweenCoordinates(
      userCoordinates,
      gymCoordinates,
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 meters

    if (distanceInKilometers > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceExceededError()
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error('Check-in already exists on this date')
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
