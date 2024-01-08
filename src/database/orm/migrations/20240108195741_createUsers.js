
export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("email").notNullable()
    table.text("password").notNullable()
    table.text("avatar")
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

}

export function down(knex) {
  return knex.schema.dropTable('users')
}
