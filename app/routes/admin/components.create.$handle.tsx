import {ActionArgs, redirect} from "@remix-run/node";
import {createComponent} from "remixCms/actions/component/create";

export async function loader({ params: { handle } }: ActionArgs)
{
    return redirect('/admin/components/edit/' + (await createComponent({
        type: handle!
    })).id);
}
export default function Edit()
{
    return (<>Redirecting...</>);
}
