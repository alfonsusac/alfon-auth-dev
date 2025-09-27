// import 'dotenv/config'
// import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { PrismaClient } from '@/generated/prisma'

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
prisma = (global as any).prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma

export default prisma
