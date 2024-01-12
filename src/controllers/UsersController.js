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
        return res.status(200).json("User created with success")
    }
    async show(req, res) {
        const { id } = req.params
        const user = await orm('users').where({ id }).first()
        if (!user)
            throw new AppError('User not found', 404)
        return res.status(200).json(user)
    }
    async update(req, res) {
        const { email, name, oldPassword, newPassword } = req.body
        const { id } = req.params

        const user = await orm('users').where({ id }).first()
        if (!user)
            throw new AppError("User not found", 400)
        if (email) {
            const userWithUpdatedEmail = await orm('users').where({ email }).first()
            if (userWithUpdatedEmail)
                throw new AppError("This email is not available", 400)
        }
        if (name) {
            if (name === user.name)
                throw new AppError('The name is the same as the one already registered', 400)
        }
        if (email) {
            if (email === user.email)
                throw new AppError('The email is the same as the one already registered', 400)
        }

        if (newPassword)
            if (oldPassword) {
                const validatePreviousPassword = await pkg.compare(oldPassword, user.password)
                if (!validatePreviousPassword)
                    throw new AppError('To change your password you need to enter your previous one', 400)
                const checkIfEqualsPreviewPassword = await pkg.compare(newPassword, user.password)
                if (checkIfEqualsPreviewPassword)
                    throw new AppError('The new password is the same as the one already registered', 400)
            } else
                throw new AppError('To change your password you need to inform the previous one', 400)
        user.name = name ?? user.name
        user.email = email ?? user.email
        user.password = newPassword ? (await pkg.hash(newPassword, 8)) : user.password;
        await orm('users').where({ id }).update(user)
        return res.status(200).json("User updated with Success")
    }
}
export { UsersController }