import {db} from "remixCms/utils/db";

export async function createComponent({ type }: { type: string })
{
    return db.component.create({ data: { type }});
}
