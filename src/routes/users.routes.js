import { Router } from 'express'
import { UsersController } from '../controllers/UsersController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import multer from 'multer'
import { MULTER } from '../configs/upload.js'
import { UsersAvatarController } from '../controllers/UsersAvatarController.js'

const upload = multer(MULTER)

const usersRoutes = Router()
const usersController = new UsersController()
const usersAvatarController = new UsersAvatarController()
usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.get("/:id", usersController.show)
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), usersAvatarController.update) 
//formdata está em upload.single

export { usersRoutes }