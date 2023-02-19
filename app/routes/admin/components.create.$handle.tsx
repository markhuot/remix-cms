import {redirect} from "@remix-run/node";
import {createComponent} from "remixCms/actions/component/create";

export async function loader()
{
    return redirect('/admin/components/edit/' + (await createComponent()).id);
}
export default function Edit()
{
    return (<>Redirecting...</>);
}
