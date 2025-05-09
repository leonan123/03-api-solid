import { randomUUID } from 'node:crypto'

import dayjs from 'dayjs'
import type { CheckIn, Prisma } from 'generated/prisma'

import { CheckInsRepository } from './../check-ins.repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)
    return checkIn ?? null
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const dayOfCheckIn = dayjs(checkIn.created_at)
      const isOnSameDate =
        dayOfCheckIn.isAfter(startOfTheDay) &&
        dayOfCheckIn.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: data.id || randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(data: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === data.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = data
    }

    return data
  }
}
