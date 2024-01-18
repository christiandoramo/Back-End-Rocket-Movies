import path from 'path'
import url from 'url'
import multer from 'multer'
import crypto from 'crypto'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMP_FOLDER = path.resolve(__dirname, '..', '..', 'temp')
// const UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, 'uploads')
const UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, '..', 'public', 'uploads')

const MULTER = {
    storage: multer.diskStorage({
        destination: TEMP_FOLDER,
        filename(req, file, cb) {
            const fileHash = crypto.randomBytes(8).toString('hex')
            const extName = path.extname(file.originalname)
            const baseName = path.basename(file.originalname, extName)
            const fileName = `${baseName.replace(/ /g, "-")}-${fileHash}${extName}`
            return cb(null, fileName)
        }
    })

}

export { TEMP_FOLDER, UPLOADS_FOLDER, MULTER }