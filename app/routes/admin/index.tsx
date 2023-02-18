import {remixCmsLoader} from "~/../admin/routing/loader";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/node";
import {db} from "../../../admin/utils/db";

export const loader = remixCmsLoader({
    authenticated: true,
    loader: async () => {
        const componentTypes = await db.componentType.findMany();

        return json({ componentTypes }, { status: 200 });
    },
});

export default function Index() {
    const { componentTypes } = useLoaderData<typeof loader>();

    return (<>
        <div>
            {componentTypes.map((type: any) => (
                <a href={`/admin/components/create/${type.handle}`}>+ Add {type.name}</a>
            ))}
        </div>
    </>);
}
