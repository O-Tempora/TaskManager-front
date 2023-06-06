import { workspace } from "../workspace";
import { jwt } from "../jwt";
import { statuses } from "../statuses";
import { persons } from "../persons";

export async function load ({ fetch, params, url }){
    const usr = url.searchParams.get('usr');
    if (usr === null || ""){
        return;
    }
    const res = await fetch(`http://localhost:5192/workspace/${params.slug}`, {
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
    const res_persons = await fetch(`http://localhost:5192/person/ws-${params.slug}`, {
        method: "get",
        headers:{
            'Authorization': "Bearer " + usr,
        }
    });
    const res_user = await fetch(`http://localhost:5192/person/byToken`, {
        method: "get",
        headers:{
            'Authorization': "Bearer " + usr,
        }
    });

    let data = await res.json();
    let isAdmin = await res_admin.json();
    let stat = await res_statuses.json();
    let prsns = await res_persons.json();
    let user = await res_user.json();

    workspace.set({data, isAdmin, user});
    jwt.set(usr);
    statuses.set(stat);
    persons.set(prsns);

    return {
        data: data,
        isAdmin: isAdmin,
        statuses: stat,
        persons: prsns,
    }
}