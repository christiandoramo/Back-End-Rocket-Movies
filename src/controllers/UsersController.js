import { orm } from "./../database/orm/index.js";
import { AppError } from "../utils/AppError.js";
import pkg from 'bcryptjs'

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body

        if (!(name && email && password)) // checking parmas
            throw new AppError('Invalid params', 400)

        const emailUnavailable = await orm('users').where({ email }).first()
        if (emailUnavailable) // email is in Use?
            throw new AppError('Email unavailable', 400) // email first validation
        const hashedPassword = await pkg.hash(password, 8)
        const user = { name, email, password: hashedPassword }
        await orm('users').insert(user) 
        res.status(200).json("User created with success")
    }
}
export { UsersController }