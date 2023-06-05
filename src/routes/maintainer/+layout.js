import { jwt } from '../jwt.js';

export async function load ({ fetch, params, url }){
    const usr = url.searchParams.get('usr');
    if (usr === null || ""){
        return;
    }
    const res_p = await fetch(`http://localhost:5192/maintainer/person?page=1&take=16`, {
        method: "get",
        headers: {
            'Authorization': "Bearer " + usr,
        }
    });
    const res_ws = await fetch(`http://localhost:5192/maintainer/workspace?page=1&take=16`, {
        method: "get",
        headers: {
            'Authorization': "Bearer " + usr,
        }
    });
    const prs = await res_p.json()
    const ws = await res_ws.json()

    jwt.set(usr)

    return {
        prs: prs, 
        ws:ws
    }
}