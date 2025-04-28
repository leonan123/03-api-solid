import { randomUUID } from 'node:crypto'

import type { Gym, Prisma } from 'generated/prisma'
import { Decimal } from 'generated/prisma/runtime/library'

import type { GymsRepository } from '../gyms.repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)
    return gym || null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude as Prisma.Decimal),
      longitude: new Decimal(data.longitude as Prisma.Decimal),
    }

    this.items.push(gym)

    return gym
  }
}
