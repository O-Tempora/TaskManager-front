import { workspace } from "../workspace";

export async function load ({ fetch, params, url }){
    const usr = url.searchParams.get('usr');
    console.log(usr);
    if (usr === null || ""){
        return;
    }
    const res = await fetch(`http://localhost:5192/workspace-${params.slug}`, {
        method: "get",
        headers: {
            'Authorization': "Bearer " + usr,
        }
    });
    let data = await res.json();

    workspace.set(data);
    return {data: data}
}