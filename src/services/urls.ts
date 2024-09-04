import knex from "../config/knex";
import httpError from "http-errors";
import { validateCreateShortURL, validateUpdateShortURL } from "./validations";
export const createShortURL = async (
    body: { url: string; id?: string },
    user_id: number
) => {
    validateCreateShortURL(body);
    if (body.id) {
        const current_record = await knex("urls")
            .where({ id: body.id })
            .first();
        if (current_record) {
            throw new httpError.Conflict(
                "The ID that you provided already exists in the database"
            );
        }
    }
    const results = await knex("url").insert(
        { url: body.url, id: body.id, user_id },
        "*"
    );
    return results[0];
};

export const resolveURL = async (id: string) => {
    const url = await knex("urls").where({ id }).select(["url"]).first();
    if (!url) {
        throw new httpError.NotFound("URL not found");
    }
    return url.url;
};

export const updateURL = async (
    id: string,
    body: { url: string },
    user_id: number
) => {
    validateUpdateShortURL(body);
    const url = await knex("urls").where({ id }).select(["user_id"]).first();
    if (!url) {
        throw new httpError.NotFound("URL not found");
    }
    if (url.user_id !== user_id) {
        throw new httpError.Unauthorized(
            "You dont have permission to update this URL"
        );
    }
    const results = await knex("urls")
        .where({ id })
        .update({ url: body.url }, "*");
    return results[0];
};

export const deleteURL = async (id: string, user_id: number) => {
    const url = await knex("urls").where({ id }).select(["user_id"]).first();
    if (!url) {
        throw new httpError.NotFound("URL not found");
    }
    if (url.user_id !== user_id) {
        throw new httpError.Unauthorized(
            "You dont have permission to update this URL"
        );
    }
    await knex("urls").where({ id }).delete();
    return true;
};

export const getURLS = async (
    user_id: number,
    limit: number,
    offset: number
) => {
    const results = await knex("urls")
        .where({ user_id })
        .limit(limit || 15)
        .offset(offset || 0);
    return results;
};
