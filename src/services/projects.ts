import { type User } from "@/lib/auth"
import prisma from "@/lib/db"
import { randomBytes } from "crypto"


// function createProjectsTable() {
//   return sql`CREATE TABLE IF NOT EXISTS projects (
//     id SERIAL PRIMARY KEY, 
//     user_id TEXT, 
//     name TEXT, 
//     desc TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )`
// }

// function createProjectKeysTable() {
//   return sql`CREATE TABLE IF NOT EXISTS project_keys (
//     id SERIAL PRIMARY KEY, 
//     project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, 
//     name TEXT, 
//     value TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )`
// }

export async function getProjects(user: User) {
  const projects = await prisma?.project.findMany({
    where: { user_id: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return projects
}

export async function getProjectKeys(user: User, project_id: string) {
  const keys = await prisma?.projectKey.findMany({
    where: { project: { user_id: user.id, id: project_id } },
    orderBy: { createdAt: 'desc' },
  })
  return keys
}

export async function createProject(user: User, id: string, name: string, desc: string) {

  const existing = await prisma?.project.findFirst({
    where: { user_id: user.id, id },
  })
  if (existing)
    return "id_exists"


  const project = await prisma?.project.create({
    data: {
      id,
      user_id: user.id,
      name,
      description: desc,
    },
  })

  const key = await prisma?.projectKey.create({
    data: {
      projectId: id,
      description: 'Default API Key',
      key: randomBytes(32).toString('hex'),
    },
  })

  return {
    ...project,
    key,
  }
}



// export async function createProject(user: User, id: string, name: string, desc: string) {
//   await createProjectsTable()

//   const existing = await sql`SELECT * FROM projects WHERE user_id = ${ user.id } AND id = ${ id }`

//   if (existing.length === 0) {

//     const project = await sql`INSERT INTO projects (user_id, name, string) VALUES (${ user.id }, ${ name }, ${ desc }) RETURNING *`

//     await createProjectKeysTable()
//     const key = await sql`INSERT INTO project_keys (project_id, name, value) VALUES (${ project[0].id }, 'Default API Key', ${ randomBytes(32).toString('hex') }) RETURNING *`

//     return {
//       ...project[0],
//       key,
//     }
//   }

//   else
//     return "id_exists"
// }