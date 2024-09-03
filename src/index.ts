import "dotenv/config";
import knex, { onDatabaseConnect } from "./config/knex";

const main = async () => {
    try {
        await onDatabaseConnect();
        console.log("Database is connected");
        const users = await knex("users");
        console.log(users[0].password);
    } catch (e) {
        console.log(e);
    }
};

main();
