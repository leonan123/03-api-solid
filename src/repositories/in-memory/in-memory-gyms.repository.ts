import { randomUUID } from 'node:crypto'

import type { Gym, Prisma } from 'generated/prisma'
import { Decimal } from 'generated/prisma/runtime/library'

import type { GymsRepository } from '../gyms.repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)
    return gym || null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
