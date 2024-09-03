import Knex from 'knex';

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const knex = Knex({
    client: 'postgresql',
    connection: {
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE
    }
});

export const onDatabaseConnect = async () => knex.raw('SELECT 1');
export default knex;
