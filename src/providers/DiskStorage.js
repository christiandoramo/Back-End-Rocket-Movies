import path from 'path'
import fs from 'fs'
import * as uploadConfig from '../configs/upload.js'
import { AppError } from '../utils/AppError.js'

class DiskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TEMP_FOLDER, file),
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        )
        return file
    }
    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        try {
            const stats = await fs.promises.stat(filePath)
        } catch (error) {
            console.error(error)
            return;
        }
        await fs.promises.unlink(filePath)
    }
}

export default DiskStorage