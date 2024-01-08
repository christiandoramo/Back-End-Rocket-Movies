import { orm } from "./../database/orm/index.js";
import { AppError } from "../utils/AppError.js";

class NotesController {
    async create(req, res) {
        const { title, description, rating, tags } = req.body
        const { user_id } = req.params

        if (isNaN(rating)) // checking parmas
            throw new AppError('Invalid params', 400)
        if (Number(rating) < 1 || Number(rating) > 5)
            throw new AppError('Invalid params', 400)

        const user = await orm('users').where({ id: user_id }).first()
        if (!user)
            throw new AppError('User not found', 400)
        const [note_id] = await orm('notes').insert({ title, description, rating, user_id })
        const tagsToInsert = tags.map(tag => ({ user_id, note_id, name: tag }))
        await orm('tags').insert(tagsToInsert)
        res.status(200).json("Note created with success")
    }
    async delete(req, res) {
        const { note_id, user_id } = req.query

        if (isNaN(note_id) || isNaN(user_id))
            throw new AppError('invalid query')
        const [user] = await orm('users').where({ id: user_id })
        const [note] = await orm('notes').where({ id: note_id })
        if (!user)
            throw new AppError('User not found', 400)
        if (!note)
            throw new AppError('Note not found', 400)
        if (note.user_id != user_id)
            throw new AppError('This note is not from this user', 400)
        await orm('notes').where({ id: note_id }).delete(note).then(() => res.status(200).json('Note deleted with success'))
    }
}
export { NotesController }