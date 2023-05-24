import { workspace } from "../workspace";
import { jwt } from "../jwt";
import { statuses } from "../statuses";

export async function load ({ fetch, params, url }){
    const usr = url.searchParams.get('usr');
    if (usr === null || ""){
        return;
    }
    const res = await fetch(`http://localhost:5192/workspace-${params.slug}`, {
        method: "get",
        headers: {
            'Authorization': "Bearer " + usr,
        }
    });
    const res_admin = await fetch(`http://localhost:5192/person/isAdmin-${params.slug}`, {
        method: "get",
        headers:{
            'Authorization': "Bearer " + usr,
        }
    });
    const res_statuses = await fetch(`http://localhost:5192/status`, {
        method: "get",
        headers:{
            'Authorization': "Bearer " + usr,
        }
    });

    let data = await res.json();
    let isAdmin = await res_admin.json();
    let stat = await res_statuses.json();

    workspace.set({data, isAdmin});
    jwt.set(usr);
    statuses.set(stat);

    return {
        data: data,
        isAdmin: isAdmin,
        statuses: stat
    }
}