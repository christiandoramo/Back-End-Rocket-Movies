import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import authConfig from "../configs/auth.js";

export function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader)
        throw new AppError('Authorization token not found', 401)
    // primeira posição é irrelevante
    const [, token] = authHeader.split(' ') //auth do tipo BEARER = "BEARER XXXTOKENXX"

    try {
        const verify = jwt.verify(token, authConfig.jwt.secret)
        const { sub: user_id } = verify

        req.user = {
            id: Number(user_id)
        }
        return next()
    } catch {
        throw new AppError('Invalid authorization token', 401)
    }
}