<script>
    import axios from "axios";
    import "../app.postcss";
    import 'iconify-icon';
    import TaskModal from "./TaskModal.svelte";
    import { onMount } from "svelte";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let tasks = [];
    export let gr = -1;
    //console.log("Задачи: ", tasks)

    let showTaskModal = false;
    const close = () =>{
        showTaskModal = false;
        updateTask(tasks[currTask].id);
    }
    let group = -1;
    let descr = "";
    let startAt = "";
    let finishAt = "";
    let currTask = -1;
    const showModal = (id, i) =>{
        currTask = i;
        getTask(id);
        showTaskModal = true;
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

            descr = data.description;
            startAt = data.startAt.slice(0,10);
            finishAt = data.finishAt.slice(0,10);
            group = data.groupId;
        } catch(e){
            console.log(e)
        }
    }
    let updateTask = async (id) =>{
        try{
            await axios.put(
                `http://localhost:5192/task/${id}`,
                {
                    id: id,
                    description: descr,
                    startAt: new Date(parseInt(startAt.slice(0, 4)), parseInt(startAt.slice(5, 7)) - 1, parseInt(startAt.slice(8))),
                    finishAt: new Date(parseInt(finishAt.slice(0, 4)), parseInt(finishAt.slice(5, 7)) - 1, parseInt(finishAt.slice(8))),
                    status: tasks[currTask].status,
                    groupId: gr,
                }
            );
            tasks[currTask].description = descr;
        } catch(e){
            console.log(e);
        }
    }
    let deleteTask = async (id) =>{
        try{
            const res = await axios.delete(
                `http://localhost:5192/task/${id}`,
            );
            tasks = tasks.filter(item => item.id !== id);
        } catch(e){
            console.log(e);
        }
    }

</script>

<TaskModal bind:descr bind:startAt bind:finishAt show={showTaskModal} on:close={() => close()}/>
{#each tasks as task, i}
    <div class="flex flex-row items-start">
        <div on:keyup on:click={() => dispatch('opentask', { id: task.id,})} class="flex flex-col w-80 rounded-md border-black border-2 p-2 my-2 bg-zinc-200 hover:bg-sky-100 shadow-xl">
            <div class="flex flex-row justify-between w-full">
                <p class="font-serif font-bold italic text-base line-clamp-1 text-black">At: {task.createdAt}</p>
                <p class="font-serif font-bold italic text-base line-clamp-1 text-black underline">{task.status}</p>
            </div>
            <p class="font-serif font-medium text-lg line-clamp-6 py-1">{task.description}</p>
            <div class="w-full flex flex-row justify-between border-2 border-transparent border-t-[#1e3d59]">
                <ul class="w-full">
                    {#each task.persons as person}
                        <li class="py-1">
                            {person.name}
                        </li>
                    {/each}
                </ul>
                <iconify-icon icon="fluent:people-team-32-filled" class="text-2xl"/>
            </div>
        </div>
        <button on:click={() => deleteTask(task.id)} class="px-1 bg-transparent hover:bg-slate-200 invisible group-hover:visible h-min">
            <iconify-icon icon="material-symbols:delete-outline-rounded" class="text-2xl text-gray-600 mt-2"/>
        </button>
    </div>
{/each}