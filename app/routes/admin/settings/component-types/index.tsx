import {remixCmsLoader} from "../../../../../admin/routing/loader";
import {json} from "@remix-run/node";
import {db} from "../../../../../admin/utils/db";
import {useLoaderData} from "@remix-run/react";

export const loader = remixCmsLoader({
    loader: async () => {
        const componentTypes = await db.componentType.findMany();

        return json({ componentTypes }, { status: 200 });
    }
})

export default function ComponentTypes() {
    const { componentTypes } = useLoaderData<typeof loader>();

    return (<>
        <h1>Component Types</h1>
        <ul>
            {componentTypes.map((type: any) => (
                <li>
                    <a href={`/admin/settings/component-types/edit/${type.handle}`}>{type.name}</a>
                </li>
            ))}
        </ul>
        <p><a href="/admin/settings/component-types/create">Add new component type</a></p>
    </>);
}
