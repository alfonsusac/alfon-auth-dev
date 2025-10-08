// import 'dotenv/config'
// import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { PrismaClient, type Project } from '@/generated/prisma'

neonConfig.webSocketConstructor = ws

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

// Type definitions
// declare global {
//   var prisma: PrismaClient | undefined
// }

let prisma: PrismaClient


const connectionString = `${ process.env.DATABASE_URL }`
const adapter = new PrismaNeon({ connectionString })
prisma = (global as any).prisma || new PrismaClient({ adapter }).$extends({
  result: {
    $allModels: {
      createdAt: {
        needs: { createdAt: true } as any,
        compute(data: { createdAt: Date }) {
          return data.createdAt.toISOString()
        },
      },
      updatedAt: {
        needs: { updatedAt: true } as any,
        compute(data: { updatedAt: Date }) {
          return data.updatedAt.toISOString()
        },
      },
    },
  },
})
if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma

export default prisma

export type WithSerializedDates<Type> = Type extends Date ? string :
  Type extends { [key: string]: any } ? {
    [Key in keyof Type]: WithSerializedDates<Type[Key]>
  } : Type extends Array<infer U> ? Array<WithSerializedDates<U>> : Type;


export function serializeDate<T>(value: T): WithSerializedDates<T> {
  if (value instanceof Date)
    return value.toISOString() as WithSerializedDates<T>
  if (Array.isArray(value))
    return value.map(serializeDate) as WithSerializedDates<T>
  if (value !== null && typeof value === 'object') {
    const res: any = {}
    for (const key in value) {
      res[key] = serializeDate((value as any)[key])
    }
    return res as WithSerializedDates<T>
  }
  return value as WithSerializedDates<T>
}
