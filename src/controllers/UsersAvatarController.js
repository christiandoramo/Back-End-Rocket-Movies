import { orm } from "../database/orm/index.js";
import DiskStorage from "../providers/DiskStorage.js";
import { AppError } from "../utils/AppError.js";


class UsersAvatarController {
    async update(req, res) {
        const { filename } = req.file
        const user_id = req.user.id
        const user = await orm('users').where({ id: user_id }).first()
        if (!user)
            throw new AppError("User not found", 400)

        const diskStorage = new DiskStorage()

        if (user.avatar) {
            diskStorage.deleteFile(user.avatar)
        }
        const avatar = await diskStorage.saveFile(filename)
        user.avatar = avatar || user.avatar
        await orm('users').where({ id: user_id }).update(user)
        return res.status(200).json({ avatar })
    }
}
export { UsersAvatarController }