import prisma from "@/lib/db"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, context: { params: Promise<{ projectid: string }>}) {
  
  // Inputs
  const projectid = (await context.params).projectid
  // LAST TYPED

  // DB Calls
  const project = await prisma.project.findFirst({ where: { id: projectid } })
  if (!project)
    return new Response("Project not found", { status: 404 })



}