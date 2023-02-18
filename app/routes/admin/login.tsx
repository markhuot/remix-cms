import type { RemixCmsActionArgs} from "../../../admin/routing/action";
import {remixCmsAction} from "../../../admin/routing/action";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {db} from "../../../admin/utils/db";
import {abort_if, abort_unless} from "../../../admin/utils/control-flow";
import {useActionData} from "@remix-run/react";
import {commitSession, getSession} from "../../../admin/session";
import {redirect} from "@remix-run/node";
import {remixCmsLoader} from "../../../admin/routing/loader";

export const loader = remixCmsLoader({
    authenticated: false,
});

export const action = remixCmsAction({
    validate: {
        email: z.string().min(5).email(),
        password: z.string().min(5),
    },
    action: async ({ formData: { email, password } }: RemixCmsActionArgs) => {
        const user = await db.user.findUnique({where: { email }});
        abort_if(user === null, 422, 'User not found');

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        abort_unless(isCorrectPassword, 422, 'Incorrect password');

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
                    <button>Login</button>
                </p>
            </form>
        </>
    );
}
