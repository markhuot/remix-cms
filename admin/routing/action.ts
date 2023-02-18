import type {ActionArgs} from "@remix-run/node";
import { json} from "@remix-run/node";
import type { ZodError} from "zod";
import {z} from "zod";

type RemixCmsAction = {
    validate?: any;
    action?: (args: RemixCmsActionArgs) => Promise<any>;
}

export type RemixCmsActionArgs = ActionArgs & {
    form: FormData;
    formData: any;
}

export function remixCmsAction({ validate, action }: RemixCmsAction): (args: RemixCmsActionArgs) => Promise<any>
{
    return async (args: ActionArgs) => {
        const formData = await args.request.formData();
        const data = Array.from(formData.entries()).reduce((data: any, [key, value]) => {
            data[key] = value;
            return data;
        }, {});

        try {
            if (validate) {
                validateFormData(formData, data, validate)
            }

            return action ? await action({ ...args, form: formData, formData: data }) : {};
        }
        catch (e: any) {
            if (e.isUserFacingError) {
                return json({
                    error: e.message,
                    errors: e.errors,
                    old: data,
                }, { status: e.statusCode });
            }

            throw e;
        }
    };
}

function validateFormData(formData: FormData, data: any, rules: any)
{
    const schema = z.object(rules);
    const result = schema.safeParse(data);

    if (!result.success) {
        throw new ValidationError(result.error);
    }
}

class ValidationError extends Error {
    isUserFacingError = true;
    zodError: ZodError;
    statusCode = 422;

    constructor(zodError: ZodError) {
        super('Validation errors occurred');

        this.zodError = zodError;
    }

    get errors() {
        return this.zodError.issues.reduce((errors: any, error) => {
            errors[error.path.join('.')] = error.message;

            return errors;
        }, {})
    }
}
