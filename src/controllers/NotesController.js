import { orm } from "./../database/orm/index.js";
import { AppError } from "../utils/AppError.js";

export class NotesController {
    async create(req, res) {
        const { title, description, rating, tags } = req.body
        const user_id = req.user.id

        if (!rating) // checking parmas
            throw new AppError('Invalid params', 400)
        if (Number(rating) < 0 || Number(rating) > 5)
            throw new AppError('Invalid params', 400)

        const user = await orm('users').where({ id: user_id }).first()
        if (!user)
            throw new AppError('User not found', 400)
        const [note_id] = await orm('notes').insert({ title, description, rating, user_id })
        if (tags) {
            const tagsToInsert = tags.map(tag => ({ user_id, note_id, name: tag }))
            await orm('tags').insert(tagsToInsert)
        }

        return res.status(200).json("Note created with success")
    }
    async show(req, res) {
        const { id } = req.params

        if (!id)
            throw new AppError('Invalid params', 400)

        const note = await orm('notes').where({ id }).first()
        if (!note)
            throw new AppError('Note not found', 400)

        const tags = await orm('tags').where({ note_id: id })
        return res.status(200).json({
            ...note,//devolve cada campo de note separado como atributo
            tags,// desse objeto json juntos com o array de tags
        })
    }
    async index(req, res) {

        const { title } = req.query
        let notes
        if (title) {
            notes = await orm("notes")
                .whereLike("title", `%${title}%`)
                .orderBy("title")
        } else {
            notes = await orm("notes")
                .orderBy("title")
        }

        const allTags = await orm("tags")

        const notesWithTags = notes.map(note => {
            const tagsForThisNote = allTags.filter(tag => tag.note_id === note.id)
            return {
                ...note,
                tags: tagsForThisNote
            }
        })
        // const tagNames = notesWithTags.flatMap(tags => tags.name)
        return res.status(200).json(notesWithTags)
    }
    async delete(req, res) {
        const { id } = req.params
        const user_id = req.user.id

        if (!id || !user_id)
            throw new AppError('Invalid params', 400)
        const user = await orm('users').where({ id: user_id }).first()
        const note = await orm('notes').where({ id }).first()
        if (!user)
            throw new AppError('User not found', 400)
        if (!note)
            throw new AppError('Note not found', 400)
        if (note.user_id != user_id)
            throw new AppError('This note is not from this user', 401)
        return (await orm('notes').where({ id }).delete(note).then(() => (res.status(200).json('Note deleted with success'))))
    }
}