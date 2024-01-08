function up(knex) {
    return knex.schema.createTable("notes", (table) => {
        table.increments("id")
        table.text("title")
        table.text("description")
        table.integer('rating').notNullable()
        table.integer('user_id').references('id').inTable('users').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })

}
function down(knex) {
    return knex.schema.dropTable('notes')
}
export { up, down }