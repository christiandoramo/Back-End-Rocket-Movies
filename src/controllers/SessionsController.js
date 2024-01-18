import { AppError } from '../utils/AppError.js';
import { orm } from '../database/orm/index.js';
import authConfig from '../configs/auth.js';
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';

class SessionsController {
    async create(req, res) {
        const { email, password } = req.body

        const user = await orm('users').where({ email }).first()
        if (!user)
            throw new AppError('User not found', 400)
        const checkPassword = await pkg.compare(password, user.password)
        if (!checkPassword)
            throw new AppError('Email or password incorrect', 401)

        const { secret, expiresIn } = authConfig.jwt
        const token = jwt.sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        res.status(200).json({ user, token })
    }
}
export { SessionsController };