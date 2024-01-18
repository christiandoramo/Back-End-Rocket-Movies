import path from 'path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function connection() {
    open({
        filename: path.resolve(__dirname, "..", "database.db"),
        driver: sqlite3.Database
    }).then(() => console.log("Database started with success"))
        .catch(error => console.error(error))

}

export { connection }