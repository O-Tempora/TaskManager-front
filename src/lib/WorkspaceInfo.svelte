<script>
    import 'iconify-icon';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from "svelte"
    export let isAdmin
    export let info

    const dispatch = createEventDispatcher();
    const close = () =>{
        dispatch('close');
    }
    const save = () =>{
        dispatch('save');
    }
</script>

<div class="fixed top-0 right-0 bg-zinc-800 h-full w-[660px] flex flex-col p-4" transition:fly={{x: '100%'}}>
    <div class="w-full flex flex-row justify-between">
        {#if isAdmin}
            <button class="text-white text-2xl hover:bg-zinc-700 rounded-lg p-2 flex flex-row items-center" on:click={save}>
                <iconify-icon icon="fluent-mdl2:save"/>
                <p class="ml-2">Save</p>
            </button>
        {/if}
        <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => close()}>
            <iconify-icon icon="material-symbols:close"/>
        </button>
    </div>

    <p class="w-full text-4xl text-white text-center overflow-auto mt-4">{info.name}</p>

    {#if isAdmin}
        <div contenteditable="true" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500" bind:textContent={info.description}></div>
    {:else}
        <div contenteditable="false" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500">
            {info.description}
        </div>
    {/if}
    
    <div class="flex flex-row w-full content-start">
        <p class="text-2xl text-green-400 text-start overflow-auto mt-2 ml-2">Created at: </p>
        <p class="text-2xl text-white text-start overflow-auto mt-2 ml-2">{info.createdAt.slice(0, 10)}</p>
    </div>

    <div class="flex flex-row w-full content-start">
        <p class="text-2xl text-amber-300 text-start overflow-auto mt-4 ml-2">Status: </p>
        {#if isAdmin}
            <input type="checkbox" class="ml-4 mt-4" bind:checked={info.isActive}>
        {/if}
        <p class="text-2xl text-white italic text-start overflow-auto mt-4 ml-2 pr-2">
            {#if info.isActive}
                Active
            {:else}
                Inactive
            {/if}
        </p>
    </div>

    {#if !info.isActive && info.closed_at != null}
        <div class="flex flex-row w-full content-start">
            <p class="text-2xl text-red-400 text-start overflow-auto mt-2 ml-2">Closed at: </p>
            <p class="text-2xl text-white text-start overflow-auto mt-2 ml-2">{info.closed_at.toDateString()}</p>
        </div>
    {/if}
</div>