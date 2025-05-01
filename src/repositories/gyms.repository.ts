import type { Gym, Prisma } from 'generated/prisma'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  findById: (gymId: string) => Promise<Gym | null>
  findManyNearby: (params: FindManyNearbyParams) => Promise<Gym[]>
  findMany: (query: string, page: number) => Promise<Gym[]>
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
}
