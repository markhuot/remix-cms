import {db} from "remixCms/utils/db";

export async function createComponent(type)
{
    return db.component.create({ data: { type }});
}
