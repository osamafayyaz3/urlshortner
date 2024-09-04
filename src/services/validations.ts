import Validator from "validatorjs";

type RequestBody = { [key: string]: any };

const validateBody = (
    body: RequestBody,
    validation_schema: Validator.Rules
) => {
    let validation = new Validator(body, validation_schema);

    if (validation.fails()) {
        const errors = validation.errors.all();
        const aggregatedErrors: string[] = [];
        Object.keys(errors).forEach((key) => {
            aggregatedErrors.push(validation.errors.first(key) as string);
        });
        throw new Error(aggregatedErrors.join(" , "));
    } else {
        return true;
    }
};

export const validateCreateShortURL = (body: RequestBody) =>
    validateBody(body, {
        url: "url|required",
        id: "string|min:5|max:10"
    });

export const validateUpdateShortURL = (body: RequestBody) =>
    validateBody(body, {
        url: "url|required",
        id: "string|min:5|max:10"
    });
