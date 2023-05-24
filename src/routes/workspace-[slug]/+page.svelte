<script>
    import axios from "axios";
    import "../../app.postcss";
    import Group from "../../lib/Group.svelte"
    import { workspace } from "../workspace";
    import { task } from "../task";
    import { statuses } from "../statuses";
    import 'iconify-icon';
    import { fly } from 'svelte/transition';

    export let data;
    
    let openTask = false;
    let showTask = async (event) => {
        openTask = true;
        let t = await getTask(event.detail.id)
        task.set(t);
    }
    let getTask = async (id) =>{
        try{
            const resp = await fetch(`http://localhost:5192/task/${id}`, {
                method: "GET",
                headers:{
                    "Content-type": "application/json",
                },
            });
            const data = await resp.json();
            data.startAt = data.startAt.slice(0, 10)
            data.finishAt = data.finishAt.slice(0, 10)
            return data;
        } catch(e){
            console.log(e)
        }
    }
    let saveTask = async () => {
        let t = {...$task}; //copy object
        t.startAt = new Date(parseInt(t.startAt.slice(0, 4)), parseInt(t.startAt.slice(5, 7)) - 1, parseInt(t.startAt.slice(8)));
        t.finishAt = new Date(parseInt(t.finishAt.slice(0, 4)), parseInt(t.finishAt.slice(5, 7)) - 1, parseInt(t.finishAt.slice(8)));
        try{
            await axios.put(
                `http://localhost:5192/task/${t.id}`,
                t
            )
            let group = $workspace.data.groups.findIndex(v => v.id === $task.groupId);
            let tsk = $workspace.data.groups[group].tasks.findIndex(v => v.id === $task.id);
            $workspace.data.groups[group].tasks[tsk] = {
                id: $task.id,
                createdAt: $workspace.data.groups[group].tasks[tsk].createdAt,
                description: $task.description,
                status: $task.status,
                persons: $workspace.data.groups[group].tasks[tsk].persons
            }
        } catch(e){
            console.log(e)
        }
    }
    
    let addGroup = async (id) =>{
        try{
            const res = await axios.post(
                `http://localhost:5192/group`,
                {
                    name: Date.now().toString(),
                    color: "#05b7dc",
                    workspace_id: id,
                }
            );
            const gr = await res.data;
            $workspace.data.groups = [...$workspace.data.groups, {name: gr.name,color: gr.color, id: gr.id,}]
        } catch(e){
            console.log(e);
        }
    }
</script>

{#if openTask && $task != null}
    <div class="fixed top-0 right-0 bg-zinc-800 h-full w-[584px] flex flex-col p-4" transition:fly={{x: '100%'}}>
        <div class="w-full flex flex-row justify-between">
            <button class="text-white text-3xl hover:bg-zinc-700 rounded-lg p-2 flex flex-row items-center" on:click={() => saveTask()}>
                <iconify-icon icon="fluent-mdl2:save"/>
                <p class="ml-2">Save</p>
            </button>
            <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => openTask = false}>
                <iconify-icon icon="material-symbols:close"/>
            </button>
        </div>
        <div class="px-4 w-full">
            <div class="text-gray-100 text-right text-lg font-bold">
                Created: {$task.createdAt.slice(0,10)}
            </div>
            {#if $workspace.isAdmin}
                <div contenteditable="true" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500" bind:textContent={$task.description}></div>
            {:else}
                <div contenteditable="false" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500">
                    {$task.description}
                </div>
            {/if}
            <div class="flex flex-col w-full justify-between">
                {#if $workspace.isAdmin}
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-green-400 font-bold py-2">Start At:</p>
                        <input type="date" bind:value={$task.startAt} class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-6"/>
                    </div>
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-[#ff6e40] font-bold py-2">Finish At:</p>
                        <input type="date" bind:value={$task.finishAt} class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-4"/>
                    </div>
                {:else}
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-green-400 font-bold py-2">Start At:</p>
                        <p class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-6">{$task.startAt}</p>
                    </div>
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-[#ff6e40] font-bold py-2">Finish At:</p>
                        <p class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-4">{$task.finishAt}</p>
                    </div>
                {/if}
            </div>
            <div class="flex flex-row w-full justify-start mt-2">
                <p class="text-xl text-white font-bold py-2">Status:</p>
                {#if $workspace.isAdmin}
                    <select bind:value={$task.status} class="ml-4 rounded-md bg-zinc-700 text-white px-2 text-lg">
                        {#each $statuses as status}
                            <option value={status.name}>{status.name}</option>
                        {/each}
                    </select>
                {:else}
                     <p class="ml-4 rounded-md bg-zinc-700 text-white px-2 text-lg">{$task.status}</p>
                {/if}
            </div>
            <div>
                <p class="mt-4 text-white font-bold italic text-3xl">Assigned:</p>
                <ul class="flex flex-col">
                    {#each $workspace.data.groups
                        .filter(v => v.id === $task.groupId)[0].tasks
                        .filter(t => t.id === $task.id)[0].persons as person}
                        <li>
                            <div class="flex flex-row justify-between p-1 items-center">
                                {#if person.role === "Admin"}
                                    <p class="text-sky-400 text-xl">{person.name}</p>
                                    <iconify-icon icon="fluent:dismiss-circle-32-regular" class="text-3xl text-red-500 hover:bg-zinc-700 rounded-lg p-1"/>
                                {:else}    
                                    <p class="text-amber-200 text-lg">{person.name}</p>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{/if}

<section class="flex flex-row content-center items-start h-full w-full">
    <nav class="h-screen bg-zinc-800 border-black border-2 flex flex-col items-center min-w-[228px] max-w-[228px]">
        <button class="layout-button flex flex-row items-center text-gray-400" on:click={() => addGroup($workspace.id)}>
            <iconify-icon icon="ic:baseline-create-new-folder" class="text-3xl text-gray-400 mx-2"/>
            <p class="text-xl">Add Group</p>
        </button>
    </nav>
    <Group bind:group={$workspace.data.groups} bind:ws_id={$workspace.data.id} on:opentask={showTask}/>
</section>