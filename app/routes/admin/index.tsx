import {remixCmsLoader} from "~/../admin/routing/loader";

export const loader = remixCmsLoader({
    authenticated: true,
});

export default function Index() {
    return (
        <>foo</>
    );
}
