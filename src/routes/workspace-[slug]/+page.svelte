<script>
    import axios from "axios";
    import "../../app.postcss";
    import Group from "../../lib/Group.svelte"
    import { workspace } from "../workspace";
    import { task } from "../task";
    import 'iconify-icon';
    import { fly } from 'svelte/transition';

    export let data;
    workspace.subscribe((value) => {
        data = value;
    });
    
    let openTask = false;
    let showTask = async (event) => {
        openTask = true;
        let t = await getTask(event.detail.id)
        task.set(t);
        console.log("Shown task:", $task);
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
            return data;
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
            $workspace.groups = [...$workspace.groups, {name: gr.name,color: gr.color, id: gr.id,}]
        } catch(e){
            console.log(e);
        }
    }
</script>

{#if openTask && $task != null}
<div class="fixed top-0 right-0 bg-zinc-800 h-full w-[584px] flex flex-col" transition:fly={{x: '100%'}}>
    <div class="w-full mx-4 my-4">
        <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => openTask = false}>
            <iconify-icon icon="material-symbols:close"/>
        </button>
    </div>
    <div contenteditable="true" class="mx-8 text-white text-2xl font-serif p-2">
        {$task.description}
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
    <Group bind:group={$workspace.groups} bind:ws_id={$workspace.id} on:opentask={showTask}/>
</section>