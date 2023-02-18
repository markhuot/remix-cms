import { remixCmsAction } from "~/../admin/routing/action";
import type { RemixCmsActionArgs } from "~/../admin/routing/action"
import { z } from "zod";
import { db } from "~/../admin/utils/db";
import {useActionData} from "@remix-run/react";
import {slugify} from "~/../admin/utils/string";
import {redirect} from "@remix-run/node";

export const action = remixCmsAction({
    validate: {
        name: z.string().min(3),
    },
    action: async ({formData : { name }}: RemixCmsActionArgs) => {
        const component = await db.componentType.create({
            data: { name, handle: slugify(name) },
        });

        return redirect('/admin/settings/component-types');
    },
});

export default function Create()
{
    const actionData = useActionData<typeof action>();

    return (<>
        <h1>Create a new component type</h1>
        <form method="post">
                <p>
                    <label>
                        Name
                        <input type="text" name="name" defaultValue={actionData?.old?.name} />
                        {actionData?.errors?.name && (<p>{actionData?.errors?.name}</p>)}
                    </label>
                </p>
                <fieldset>
                    <h2>fields</h2>
                    <p>add fields</p>
                </fieldset>
                <p>
                    <button>Login</button>
                </p>
            </form>
    </>);
}
