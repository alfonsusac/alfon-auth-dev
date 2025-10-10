"use server"

export async function redirectToNewProject(id: string) {
  return `/${ id }`
}