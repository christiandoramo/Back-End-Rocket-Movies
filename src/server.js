import 'express-async-errors';
import 'dotenv/config'
import express from 'express';
import { AppError } from './utils/AppError.js';
import { connection } from './database/db/index.js';
import { routes } from './routes/index.js';
import { UPLOADS_FOLDER } from './configs/upload.js';
import cors from 'cors'

connection() // DB connection
const app = express() // iniciando app node com express
app.use(cors()) // tornando a api acessível a diversas origens
app.use(express.json()) // fazendo os middlewares apenas trabalhar com json e suas formatações
app.use(routes) // usando todas as minhas rotas
app.use('/files', express.static(UPLOADS_FOLDER)) // Criando rota de arquivos estaticos


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

const PORT = process.env.SERVER_PORT || 3000
app.listen(PORT, () => console.log("Server is running on PORT ", PORT))