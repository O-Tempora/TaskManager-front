<script>
    import 'iconify-icon';
    import axios from 'axios';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from "svelte"
    export let isAdmin
    export let team
    export let you
    export let ws

    const dispatch = createEventDispatcher();
    const close = () =>{
        dispatch('close');
    }

    console.log(team)

    let removePerson = async (id) =>{
        try{
            await axios.delete(
                `http://localhost:5192/person/${id}/${ws}`,
            );
            team = team.filter(v => v.id !== id)
        } catch(e){
            console.log(e);
        }
    }
</script>

<div class="fixed top-0 right-0 bg-zinc-800 h-full w-[660px] flex flex-col p-4" transition:fly={{x: '100%'}}>
    <div class="w-full flex flex-row justify-end">
        <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => close()}>
            <iconify-icon icon="material-symbols:close"/>
        </button>
    </div>

    <p class="w-full text-4xl text-white text-center overflow-auto mt-4">Project Team</p>

    <div class="flex flex-col w-full content-start my-4 mt-8">
        {#each team as p}
            <div class="flex flex-col w-full border-2 rounded-xl border-sky-700 my-2">
                <div class="flex flex-row justify-start items-center p-2 mx-8">
                    <div class="w-full flex flex-row justify-between">
                        {#if p.role === "Admin"}
                            <p class="text-center text-2xl font-extrabold text-amber-400">
                                {p.name} (Admin)
                                {#if you === p.id}
                                    <span class="text-center text-2xl font-bold text-sky-500"> - you</span>
                                {/if}
                            </p>
                        {:else}
                            <p class="text-center text-2xl font-bold text-white">
                                {p.name}
                                {#if you === p.id}
                                    <span class="text-center text-2xl font-bold text-sky-500"> - you</span>
                                {/if}
                            </p>
                        {/if}
                        {#if isAdmin && p.id !== you}
                            <button class="text-red-600 text-4xl hover:bg-zinc-700 rounded-lg mx-2" on:click={() => removePerson(p.id)}>
                                <iconify-icon icon="dashicons:no"/>
                            </button>
                        {/if}
                    </div>
                </div>
                <p class="p-2 mx-8 text-base text-white">{p.email}</p>
                <p class="p-2 mx-8 text-base text-white">{p.phone}</p>
            </div>
        {/each}
    </div>
</div>