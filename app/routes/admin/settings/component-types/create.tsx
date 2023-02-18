import { remixCmsAction } from "admin/routing/action";
import type { RemixCmsActionArgs } from "admin/routing/action"
import { z } from "zod";
import { db } from "admin/utils/db";
import {useActionData} from "@remix-run/react";

export const action = remixCmsAction({
    validate: {
        name: z.string(),
    },
    action: async ({formData : { name }}: RemixCmsActionArgs) => {
        db.ComponentType.create({
            data: { name },
        });
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
                <p>
                    <button>Login</button>
                </p>
            </form>
    </>);
}