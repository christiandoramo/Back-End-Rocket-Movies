import { Router } from 'express'
import { usersRoutes } from './users.routes.js'
import { notesRoutes } from './notes.routes.js'



const routes = Router()
routes.use("/users", usersRoutes)
routes.use('/notes', notesRoutes)
export { routes }