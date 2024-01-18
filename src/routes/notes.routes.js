import { Router } from 'express'
import { NotesController } from '../controllers/NotesController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'


const notesRoutes = Router()
const notesController = new NotesController()
notesRoutes.post("/", ensureAuthenticated, notesController.create)
notesRoutes.get("/:id", notesController.show)
notesRoutes.get("/", notesController.index)
notesRoutes.delete("/:id", ensureAuthenticated, notesController.delete)




export { notesRoutes }