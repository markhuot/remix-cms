import {ActionArgs, redirect} from "@remix-run/node";
import {RemixCmsActionArgs} from "./action";
import {getSession} from "../utils/session";

type RemixCmsLoader = {
    authenticated?: boolean;
    loader?: (args: ActionArgs) => Promise<any>;
}

export function remixCmsLoader({ loader, authenticated }: RemixCmsLoader): (args: ActionArgs) => Promise<any>
{
    return async (args: ActionArgs) => {
        const session = await getSession(args.request.headers.get("Cookie"));

        if (authenticated === true && !session.has("userId")) {
            return redirect('/admin/login');
        }
        if (authenticated === false && session.has("userId")) {
            return redirect('/admin');
        }

        return loader ? await loader(args) : {};
    }
}
