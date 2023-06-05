<script>
    import axios from "axios";
    import user from "../routes/store";
    import { wsList } from "../routes/wsList";

    let ws;
    let wsRequest = async () =>{
        try{
            const res = await axios.get(
                "http://localhost:5192/workspace",
                {
                    headers:{
                        "Authorization": "Bearer " + $user,
                    }
                }
            );
            ws = res.data;
            console.log(ws);
            wsList.set(res.data.workspaces);
            return res.data;
        } catch(e){
            console.log(e);
        }
    }
    $: as = wsRequest();

    let goToWs = (id) =>{
        console.log($user)
        console.log(`http://localhost:5173/workspace-${id}?usr=${$user}`)
        window.location.replace(`http://localhost:5173/workspace-${id}?usr=${$user}`);
    }
</script>

<div class="grid grid-cols-5 gap-y-12 mt-4 min-w-[1800px] max-w-[1800px]">
    {#await as}
        <h1>...loading</h1>
    {:then}
        {#each $wsList as ws}
            <div class="ws-div" on:keyup on:click={() => goToWs(ws.id)}>
                <p class="py-2 px-4 line-clamp-2 text-2xl text-black font-bold font-serif">{ws.name}</p>
                <p class="px-4 pb-2 line-clamp-4 text-base text-stone-900 break-all w-full">{ws.description}</p>
                <p class="py-2 px-4 line-clamp-4 text-black break-all font-extrabold text-l font-serif">Role: {ws.role}</p>
                <p class="px-4 line-clamp-4 text-black break-all font-extrabold text-l font-serif">
                    Status: 
                    {#if ws.isActive}
                        <span class="text-lime-600 font-bold text-lg">Active</span>
                    {:else}
                        <span class="text-red-600 font-bold text-lg">Inactive</span>
                    {/if}
                </p>
                <p class="px-4 line-clamp-1 text-blue-500 italic font-serif text-lg font-bold my-2">Created at: {ws.createdAt.slice(0, 10)}</p>
            </div>
        {:else}
            <h1>You have no available workspaces</h1>
        {/each}
    {/await}
</div>