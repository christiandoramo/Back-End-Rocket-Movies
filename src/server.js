import 'express-async-errors';
import express from 'express';
import { AppError } from './utils/AppError.js';
import { connection } from './database/db/index.js';
import { routes } from './routes/index.js';

const app = express()
connection() // DB connection
app.use(express.json())
app.use(routes)


app.use((error, req, res, next) => {
    console.error(error)
    if (error instanceof AppError)
        return res.status(error.status).json({
            message: error.message, status: error.status
        })
    return res.status(500), json({
        status: 500,
        message: "Internal server error"
    })
})

const PORT = 3000
app.listen(PORT, () => console.log("Server is running on PORT ", PORT))