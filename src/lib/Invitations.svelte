<script>
    import 'iconify-icon';
    import axios from 'axios';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from "svelte"
    import { invites } from "../routes/invites"
    import { wsList } from '../routes/wsList';
    export let user

    const dispatch = createEventDispatcher();
    const close = () =>{
        dispatch('close');
    }

    let getInvitations = async () =>{
        try{
            const res = await fetch(`http://localhost:5192/invite`, {
                method: "GET",
                headers:{
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + user
                },
            });
            const inv = await res.json()
            invites.set(inv)
            console.log($invites)
        } catch(e){
            console.log(e)
        }
    }
    let gi = getInvitations();

    let accept = async (id, ws) =>{
        try{
            console.log(id, ws)
            const res = await axios.post(
                `http://localhost:5192/invite/${id}/${ws}`,{},
                {
                    headers:{
                        "Authorization": "Bearer " + user 
                    }
                }
            );
            const resp = res.data
            console.log(resp)
            $invites = $invites.filter(v => v.id !== id)
            $wsList = [... $wsList, resp]
        } catch(e){
            console.log(e);
        }
    }
    let decline = async(id)=>{
        try{
            await axios.delete(
                `http://localhost:5192/invite/${id}`,
                {
                    headers:{
                        "Authorization": "Bearer " + user 
                    }
                }
            );
            $invites = $invites.filter(v => v.id !== id)
        } catch(e){
            console.log(e);
        }
    }
</script>

<div class="fixed top-0 right-0 bg-slate-900 h-full w-[680px] flex flex-col p-4 items-center" transition:fly={{x: '100%'}}>
    <div class="w-full flex flex-row justify-end">
        <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => close()}>
            <iconify-icon icon="material-symbols:close"/>
        </button>
    </div>

    <p class="w-full text-4xl text-lime-200 text-center overflow-auto mt-4">Invitations</p>

    <div class="min-w-[600px] max-w-[600px] flex flex-col justify-center mt-4">
        {#await gi}
            <p>...loading</p>
        {:then} 
            {#each $invites as i}
                <div class="w-full border-2 rounded-md border-zinc-600 p-2 flex flex-col justify-start hover:bg-sky-950">
                    <div class="w-full flex flex-row justify-between">
                        <p class="w-full text-left text-white text-3xl font-bold underline">{i.workspace}</p>
                        <div class="flex flex-row">
                            <button class="text-green-500 text-4xl hover:bg-zinc-700 rounded-lg mx-2" on:click={() => accept(i.id, i.ws_id)}>
                                <iconify-icon icon="dashicons:yes-alt"/>
                            </button>
                            <button class="text-red-600 text-4xl hover:bg-zinc-700 rounded-lg mx-2" on:click={() => decline(i.id)}>
                                <iconify-icon icon="dashicons:no"/>
                            </button>
                        </div>
                    </div>
                    <p class="w-full text-left text-white text-xl font-serif">{i.description}</p>
                    <div class="w-full flex flex-row justify-between mt-2">
                        <p class="w-full text-left text-zinc-400 text-lg font-serif">Created: {i.created_at.slice(0,10)}</p>
                        <div class="w-full flex flex-col justify-end">
                            <p class="w-full text-right text-white font-bold text-lg font-sans italic">{i.sender}, </p>
                            <p class="w-full text-right text-white font-bold text-lg font-sans italic">{i.sent_at.slice(0,10)}</p>
                        </div>
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</div>