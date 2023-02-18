import {ActionArgs, json, redirect} from "@remix-run/node";
import bcrypt from "bcryptjs";
import {db} from "~/../admin/utils/db";
import {useActionData} from "@remix-run/react";
import type { RemixCmsActionArgs} from "~/../admin/routing/action";
import {remixCmsAction} from "~/../admin/routing/action";
import {z} from "zod";
import {commitSession, getSession} from "../../../admin/session";
import {remixCmsLoader} from "../../../admin/routing/loader";

export const loader = remixCmsLoader({
    authenticated: false,
});

export const action = remixCmsAction({
    validate: {
        email: z.string().min(5).email(),
        password: z.string().min(5),
        password_confirm: z.string().min(5)/*.sameAs('password')*/,
    },
    action: async ({ formData: { email, password} }: RemixCmsActionArgs) => {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: { email, password: passwordHash }
        });

        const session = await getSession();
        session.set("userId", user.id);

        return redirect('/admin', {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    },
});

export default function Index() {
    const actionData = useActionData<typeof action>();

    return (
        <>
            {actionData?.error && (<p>{actionData?.error}</p>)}
            <form method="post">
                <p>
                    <label>
                        Email
                        <input type="text" name="email" defaultValue={actionData?.old?.email} />
                        {actionData?.errors?.email && (<p>{actionData?.errors?.email}</p>)}
                    </label>
                </p>
                <p>
                    <label>
                        Password
                        <input type="password" name="password" defaultValue={actionData?.old?.password} />
                        {actionData?.errors?.password && (<p>{actionData?.errors?.password}</p>)}
                    </label>
                </p>
                <p>
                    <label>
                        Confirm password
                        <input type="password" name="password_confirm" defaultValue={actionData?.old?.password_confirm} />
                        {actionData?.errors?.password_confirm && (<p>{actionData?.errors?.password_confirm}</p>)}
                    </label>
                </p>
                <p>
                    <button>Sign up</button>
                </p>
            </form>
        </>
    );
}
