import { handleCallback } from "@/shared/auth/auth"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const code = request.nextUrl.searchParams.get('code') ?? undefined
  const state = request.nextUrl.searchParams.get('state') ?? undefined

  const { inputError, serverError, securedNextPath } = await handleCallback({
    code,
    raw_received_state: state
  })

  if (inputError) redirect('/')
  if (serverError) redirect('/')

  redirect(securedNextPath)
}