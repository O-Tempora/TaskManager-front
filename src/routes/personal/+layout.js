export async function load ({ fetch, url }){
    const usr = url.searchParams.get('usr');
    if (usr === null || ""){
        return;
    }
    const res = await fetch(`http://localhost:5192/task`, {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + usr,
        }
    });

    const data = await res.json();
    console.log(data)
    return {
        data
    }
}