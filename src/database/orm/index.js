import config from "./../../../knexfile.js";
import knex from "knex";

const orm = knex(config.development)
export { orm }