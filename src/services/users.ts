import { hashPassword, comparePassword } from "../config/encryption";
import knex from "../config/knex";
import { validateRegister, validateLogin } from "./validations";
import httpError from "http-errors";

const getUser = async (username: string) => {
    knex("users").whereRaw("LOWER(username) = LOWER(?)", [username]).first();
};
export const register = async (body: {
    username: string;
    password: string;
}) => {
    validateRegister(body);
    const current_user = await getUser(body.username);
    if (current_user) {
        throw new httpError.Conflict("Username already exists");
    }
    const user = (
        await knex("users").insert(
            {
                username: body.username.toLocaleLowerCase(),
                password: await hashPassword(body.password)
            },
            ["id", "username"]
        )
    )[0];
    return user;
};

export const login = async (body: { username: string; password: string }) => {
    validateLogin(body);
    const user = await getUser(body.username);
    if (!user) {
        throw new httpError.Unauthorized("Username or password are incorrect");
    }
    const passwordMatch = await comparePassword(body.password, user.password);
    if (!passwordMatch) {
        throw new httpError.Unauthorized("Username or password are incorrect");
    }
    return user;
};
