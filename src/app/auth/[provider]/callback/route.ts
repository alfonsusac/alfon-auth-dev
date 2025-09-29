import { signInHandleCallback } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const code = request.nextUrl.searchParams.get('code') ?? undefined
  const state = request.nextUrl.searchParams.get('state') ?? undefined

  const redirectToUrl = await signInHandleCallback(code, state)

  redirect(redirectToUrl)
}