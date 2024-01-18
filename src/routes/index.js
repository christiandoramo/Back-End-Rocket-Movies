import { Router } from 'express'

import { usersRoutes } from './users.routes.js'
import { notesRoutes } from './notes.routes.js'
import { sessionsRoutes } from './sessions.routes.js'



const routes = Router()
routes.use("/users", usersRoutes)
routes.use('/notes', notesRoutes)
routes.use('/sessions', sessionsRoutes)
export { routes }