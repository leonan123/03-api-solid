import type { Gym, Prisma } from 'generated/prisma'

export interface GymsRepository {
  findById: (gymId: string) => Promise<Gym | null>
  findMany: (query: string, page: number) => Promise<Gym[]>
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
}
