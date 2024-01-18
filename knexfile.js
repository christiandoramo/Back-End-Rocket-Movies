import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
      // host     : '127.0.0.1',
      // user     : 'your_database_user',
      // password : 'your_database_password',
      // database : 'myapp_test',
      // charset  : 'utf8'
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "orm", "migrations")
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
  }
}

export default config