import type { AppRoutes, ParamMap } from "@/../.next/types/routes"

export async function resolveNextPageProps<
  R extends AppRoutes,
>(props: PageProps<R>) {
  const params = await props.params as ParamMap[R]
  const searchParams = await props.searchParams
  return { searchParams, params }
}