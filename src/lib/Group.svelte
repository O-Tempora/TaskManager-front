<script>
    import "../app.postcss";
    import 'iconify-icon';
    import TaskShow from "./TaskShow.svelte";
    import axios from "axios";
    import GroupModal from "./GroupModal.svelte";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let group = [];
    export let ws_id;
    export let isAdmin;

    let showGroupModal = false;
    let currGroup = 0;
    let color = "";
    let name = "";

    let deleteGroup = async (id) =>{
        try{
            const res = await axios.delete(
                `http://localhost:5192/group/${id}`,
            );
            group = group.filter(item => item.id !== id);
        } catch(e){
            console.log(e);
        }
    }
    let updateGroup = async (id) =>{
        try{
            await axios.put(
                `http://localhost:5192/group/${id}`,
                {
                    id: id,
                    name: name,
                    color: color,
                    workspace_id: ws_id,
                }
            );
        } catch(e){
            console.log(e);
        }
    }
    let createTask = async (group_id, i) =>{
        try{
            const resp = await fetch("http://localhost:5192/task", {
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(group_id)
            });
            const data = await resp.json();
            group[i].tasks = [...group[i].tasks, data]
        } catch(e){
            console.log(e)
        }
    }

    const showModal = (c, n, gr) =>{
        color = c;
        name = n;
        currGroup = gr;
        showGroupModal = !showGroupModal;
    }
    const closeModal = () =>{
        updateGroup(group[currGroup].id);
        group[currGroup].name = name;
        group[currGroup].color = color;
        showGroupModal = false;
    }
</script>

<style>
    h3{
        background-color: var(--background-color);
    }
</style>

<section class="flex flex-row overflow-auto h-full">
    <GroupModal bind:color bind:name show={showGroupModal} on:close={() => closeModal()}/>
    {#each group as gr, i}
        <div class="group block flex-col m-4 p-2 items-start hover:bg-gray-300 rounded-lg h-fit">
            <div class="flex flex-row justify-between">
                <h3 style='--background-color:{gr.color};' class="px-2 py-1 w-fit rounded-md line-clamp-2 break-all overflow-hidden" on:keyup on:click={showModal(gr.color, gr.name, i)}>
                    {gr.name}
                </h3>
                <div class="flex flex-row">
                    <button on:click={() => createTask(gr.id, i)} class="px-1 bg-transparent hover:bg-slate-200 invisible group-hover:visible">
                        <iconify-icon icon="material-symbols:add-box-outline" class="text-2xl text-gray-600 mt-1"/>
                    </button>
                    {#if isAdmin}
                        <button on:click={() => deleteGroup(gr.id)} class="px-1 bg-transparent hover:bg-slate-200 invisible group-hover:visible">
                            <iconify-icon icon="material-symbols:delete-forever-sharp" class="text-2xl text-gray-600 mt-1"/>
                        </button>
                    {/if}
                </div>
            </div>
            <TaskShow bind:tasks={gr.tasks} gr={gr.id} bind:isAdmin={isAdmin} on:opentask on:move/>
        </div>
    {/each}
</section>