// Para rodar o knex ->
// npm install knex --save (pois nao salva nas dependencioas por padrao...)
// npx knex init - gera o novo knexfile
// npx knex migrate:make <nome da migration>

// pool: {
//   afterCreate: (connection, callback) => connection.run("PRAGMA foreign_keys = ON", callback)
// },
// Habilita o uso do delete onCascade no sqlite

// para rodar - npx knex migrate:latest - isso sem criar um script no package.json

para usar o ES6 - type: module e capturar o ccaminho das pastas->
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

npx knex migrate:list - veja migrates nao upadas
npx knex migrate:down <nome> - para desmontar migrates
npx knex migrate:up - veja montar as migrates - agora atualizadas
npx knext migrate:latest - pode atualizar os desmontados