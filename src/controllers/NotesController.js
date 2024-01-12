import { orm } from "./../database/orm/index.js";
import { AppError } from "../utils/AppError.js";

export class NotesController {
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
        return res.status(200).json("Note created with success")
    }
    async delete(req, res) {
        const { note_id, user_id } = req.query

        if (!note_id || !user_id)
            throw new AppError('invalid query')
        const user = await orm('users').where({ id: user_id }).first()
        const note = await orm('notes').where({ id: note_id }).first()
        if (!user)
            throw new AppError('User not found', 400)
        if (!note)
            throw new AppError('Note not found', 400)
        if (note.user_id != user_id)
            throw new AppError('This note is not from this user', 400)
        return (await orm('notes').where({ id: note_id }).delete(note).then(() => (res.status(200).json('Note deleted with success'))))
    }
    async show(req, res) {
        const { note_id, user_id } = req.query

        if (!note_id || !user_id)
            throw new AppError('invalid query')
        const user = await orm('users').where({ id: user_id }).first()
        const note = await orm('notes').where({ id: note_id }).first()
        if (!user)
            throw new AppError('User not found', 400)
        if (!note)
            throw new AppError('Note not found', 400)
        if (note.user_id != user_id)
            throw new AppError('This note is not from this user', 400)

        const tags = await orm('tags').where({ note_id })
        return res.status(200).json({
            ...note,//devolve cada campo de note separado como atributo
            tags,// desse objeto json juntos com o array de tags
        })
    }
    async index(req, res) {
        const { title, user_id } = req.query

        const user = await orm('users').where({ id: user_id }).first()
        if (!user)
            throw new AppError("User not found")
        let notes
        if (title) {
            notes = await orm("notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                //buscando notes com titles que contenham essa string
                .orderBy("title")
        } else {
            notes = await orm("notes")
                .where({ user_id })
                .orderBy("title")
        }

        const userTags = await orm("tags").where({ user_id })

        const notesWithTags = notes.map(note => {
            const tagsForThisNote = userTags.filter(tag => tag.note_id === note.id)
            return {
                ...note,
                tags: tagsForThisNote
            }
        })
        
        return res.status(200).json(notesWithTags)
    }
}