<script>
    import axios from "axios";
    import "../../app.postcss";
    import Group from "../../lib/Group.svelte"
    import WorkspaceInfo from "../../lib/WorkspaceInfo.svelte";
    import { workspace } from "../workspace";
    import { task } from "../task";
    import { statuses } from "../statuses";
    import { persons } from "../persons";
    import { comments } from "../comments";
    import { jwt } from "../jwt";
    import 'iconify-icon';
    import { fly } from 'svelte/transition';
    import { slide } from 'svelte/transition';
    import TeamList from "../../lib/TeamList.svelte";

    //export let data;
    
    console.log($workspace)

    let showMoveTask = false;
    let taskToMove = -1;
    let groupFrom = -1;
    let selected;

    let showPersonDropdown = false;
    let openTask = false;
    let openInfo = false;
    let content = "";

    let showChooseNext = false;
    let selectedPerson;

    let showInvitation = false;
    let emailToInvite;

    let showTeam = false;

    let changeDropdown = () =>{
        showPersonDropdown = !showPersonDropdown
    }
    let showTask = async (event) => {
        openTask = true;
        let t = await getTask(event.detail.id)
    }
    let getTask = async (id) =>{
        try{
            const resp = await fetch(`http://localhost:5192/task/${id}-${$workspace.data.info.id}`, {
                method: "GET",
                headers:{
                    "Content-type": "application/json",
                },
            });
            const resp_cm = await fetch(`http://localhost:5192/task/${id}/comment/`, {
                method: "GET",
                headers:{
                    "Content-type": "application/json",
                },
            });
            const data = await resp.json();
            const cm  = await resp_cm.json();
            data.task.startAt = data.task.startAt.slice(0, 10)
            data.task.finishAt = data.task.finishAt.slice(0, 10)
            task.set(data);
            comments.set(cm)

            console.log("Таск при получении: ", $task)

            return data;
        } catch(e){
            console.log(e)
        }
    }
    let saveTask = async () => {
        content = "";
        let t = {... $task}; //copy object

        t.task.startAt = new Date(parseInt(t.task.startAt.slice(0, 4)), parseInt(t.task.startAt.slice(5, 7)) - 1, parseInt(t.task.startAt.slice(8, 10)) + 1).toISOString();
        t.task.finishAt = new Date(parseInt(t.task.finishAt.slice(0, 4)), parseInt(t.task.finishAt.slice(5, 7)) - 1, parseInt(t.task.finishAt.slice(8, 10)) + 1).toISOString();
        console.log(t.task)
        if ($task.task.status !== "Done"){
            t.task.endDate = null
        } else{
            t.task.endDate = $task.task.endDate === null? new Date():$task.task.endDate
        }

        try{
            await axios.put(
                `http://localhost:5192/task/${t.task.id}`,
                t.task
            )
            let group = $workspace.data.groups.findIndex(v => v.id === $task.task.groupId);
            let tsk = $workspace.data.groups[group].tasks.findIndex(v => v.id === $task.task.id);
            $workspace.data.groups[group].tasks[tsk] = {
                id: $task.task.id,
                createdAt: $workspace.data.groups[group].tasks[tsk].createdAt,
                description: $task.task.description,
                status: $task.task.status,
                persons: [...$task.persons],
                endDate: t.task.endDate === null? null : typeof t.task.endDate === 'string' || t.task.endDate instanceof String? t.task.endDate:t.task.endDate.toISOString()
            }

            // console.log($task.task.startAt.format("yyyy-MM-ddThh:mm:ss"))
            // console.log($task.task.finishAt.format("yyyy-MM-ddThh:mm:ss"))

            $task.task.endDate = t.task.endDate === null? null : typeof t.task.endDate === 'string' || t.task.endDate instanceof String? t.task.endDate:t.task.endDate.toISOString()
            $task.task.startAt = t.task.startAt.slice(0,10)
            $task.task.finishAt = t.task.finishAt.slice(0,10)


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

    let selfAssign = async () => {
        try{
            await axios.post(
                `http://localhost:5192/person/${$workspace.user.Login}/assign-${$task.task.id}`
            );
            $task.persons = [... $task.persons, {id: $workspace.user.Id, name:$workspace.user.Login, role: $persons.filter(v => v.id === $workspace.user.Id)[0].role}]
        } catch(e){
            console.log(e);
        }
    }
    let selfDismiss = async () => {
        try{
            await axios.delete(
                `http://localhost:5192/person/${$workspace.user.Login}/dismiss-${$task.task.id}`
            );
            $task.persons = $task.persons.filter(v => v.name !== $workspace.user.Login)
        } catch(e){
            console.log(e);
        }
    }
    let Assign = async (user) => {
        try{
            await axios.post(
                `http://localhost:5192/person/${user.name}/assign-${$task.task.id}`
            );
            $task.persons = [... $task.persons, user]
        } catch(e){
            console.log(e);
        }
    }
    let Dismiss = async (user) => {
        try{
            await axios.delete(
                `http://localhost:5192/person/${user.name}/dismiss-${$task.task.id}`
            );
            $task.persons = $task.persons.filter(v => v.name !== user.name)
        } catch(e){
            console.log(e);
        }
    }

    let ChangeWSStatus = async () =>{
        let i = {...$workspace.data.info}
        i.isActive = !$workspace.data.info.isActive
        i.closed_at = i.isActive === true? null : new Date()
        try{
            await axios.put(
                `http://localhost:5192/workspace/${$workspace.data.info.id}`,
                i
            );
            $workspace.data.info.isActive = i.isActive
            $workspace.data.info.closed_at = i.closed_at.toISOString()
            console.log("Через страницу ", $workspace.data.info)
        } catch(e){
            console.log(e);
        }
    }
    let SaveInfo = async () =>{
        let i = {...$workspace.data.info}
        i.closed_at = i.isActive === true? null : new Date()
        try{
            await axios.put(
                `http://localhost:5192/workspace/${$workspace.data.info.id}`,
                i
            );
            $workspace.data.info.isActive = i.isActive
            $workspace.data.info.closed_at = i.closed_at.toISOString()
            console.log("Через окно ws ",$workspace.data.info)
        } catch(e){
            console.log(e);
        }
    }
    let DeleteWS = async () =>{
        try{
            await axios.delete(
                `http://localhost:5192/workspace/${$workspace.data.info.id}`,
            );
            window.location.replace(`http://localhost:5173`);
        } catch(e){
            console.log(e);
        }
    }
    let closeInfo = () => {
        openInfo = false
    }

    let writeComment = async (id) => {
        try{
            const res = await axios.post(
                `http://localhost:5192/task/${id}/comment`,
                {
                    content: content,
                    person_id: $workspace.user.Id,
                    task_id: id,
                    created_at: new Date()
                }
            );
            const data = await res.data;
            $comments = [data, ...$comments]
        } catch(e){
            console.log(e);
        }
    }
    let deleteComment = async (id, c_id) => {
        try{
            await axios.delete(
                `http://localhost:5192/task/${id}/comment/${c_id}`,
            );
            $comments = $comments.filter(v => v.id !== c_id)
        } catch(e){
            console.log(e);
        }
    }

    let openMove = (event) =>{
        taskToMove = event.detail.id;
        groupFrom = event.detail.gr;
        showMoveTask = true;
    }
    let moveTask = async (id) =>{
        showMoveTask = false;
        try{
            await axios.put(
                `http://localhost:5192/task/${taskToMove}-to-${id}`,
            );

            let group_from_id = $workspace.data.groups.findIndex(v => v.id === groupFrom)
            let group_to_id = $workspace.data.groups.findIndex(v => v.id === selected)
            let task_index = $workspace.data.groups[group_from_id].tasks.findIndex(v => v.id === taskToMove)

            const task = {... $workspace.data.groups[group_from_id].tasks[task_index]}
            $workspace.data.groups[group_from_id].tasks = $workspace.data.groups[group_from_id].tasks.filter(v => v.id !== taskToMove)
            $workspace.data.groups[group_to_id].tasks = [...$workspace.data.groups[group_to_id].tasks, task]
        } catch(e){
            console.log(e);
        }
    }

    let leaveWS = async () => {
        if ($workspace.isAdmin){
            showChooseNext = true;
            return
        }
        try{
            await axios.delete(
                `http://localhost:5192/person/${$workspace.user.Id}/${$workspace.data.info.id}`,
            );
            window.location.replace(`http://localhost:5173`);
        } catch(e){
            console.log(e);
        }
    }
    let chooseNextAdminAndLeave = async (id) =>{
        try{
            await axios.delete(
                `http://localhost:5192/person/${$workspace.user.Id}/${$workspace.data.info.id}?next=${id}`,
            );
            window.location.replace(`http://localhost:5173`);
        } catch(e){
            console.log(e);
        }
    }

    let sendInvite = async() =>{
        showInvitation = false
        try{
            await axios.post(
                `http://localhost:5192/invite`,
                {
                    email: emailToInvite, 
                    ws_id: $workspace.data.info.id
                },
                {
                    headers:{
                        "Authorization": "Bearer " + $jwt 
                    }
                }
            );
        } catch(e){
            console.log(e);
        }
    }

    let closeTeam = () => {
        showTeam = false
    }
</script>

{#if openTask && $task != null}
    <div class="fixed top-0 right-0 bg-zinc-800 h-full w-[584px] flex flex-col p-4" transition:fly={{x: '100%'}}>
        <div class="w-full flex flex-row justify-between">
            <button class="text-white text-3xl hover:bg-zinc-700 rounded-lg p-2 flex flex-row items-center" on:click={() => saveTask()}>
                <iconify-icon icon="fluent-mdl2:save"/>
                <p class="ml-2">Save</p>
            </button>
            <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => {openTask = false; task.set(null); content = "";}}>
                <iconify-icon icon="material-symbols:close"/>
            </button>
        </div>
        <div class="px-4 w-full mt-4 mb-2">
            <div class="flex flex-row justify-between">
                <div class="text-gray-100 text-right text-lg font-bold">
                    Created: {$task.task.createdAt.slice(0,10)}
                </div>
                {#if $task.task.endDate !== null}
                    <div class="text-lime-400 text-center text-lg font-bold">
                        Done: {$task.task.endDate.slice(0,10)}
                    </div>
                {/if}
            </div>
            {#if $workspace.isAdmin}
                <div contenteditable="true" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500" bind:textContent={$task.task.description}></div>
            {:else}
                <div contenteditable="false" class="text-white text-2xl font-serif my-2 p-2 rounded-lg border-2 border-stone-500">
                    {$task.task.description}
                </div>
            {/if}
            <div class="flex flex-col w-full justify-between">
                {#if $workspace.isAdmin}
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-green-400 font-bold py-2">Start At:</p>
                        <input type="date" bind:value={$task.task.startAt} class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-6"/>
                    </div>
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-[#ff6e40] font-bold py-2">Finish At:</p>
                        <input type="date" bind:value={$task.task.finishAt} class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-4"/>
                    </div>
                {:else}
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-green-400 font-bold py-2">Start At:</p>
                        <p class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-6">{$task.task.startAt}</p>
                    </div>
                    <div class="flex flex-row mt-2">
                        <p class="text-xl text-[#ff6e40] font-bold py-2">Finish At:</p>
                        <p class="text-lg bg-zinc-700 text-white p-1 rounded-lg ml-4">{$task.task.finishAt}</p>
                    </div>
                {/if}
            </div>
            <div class="flex flex-row w-full justify-start mt-2">
                <p class="text-xl text-white font-bold py-2">Status:</p>
                {#if $workspace.isAdmin}     
                    <select bind:value={$task.task.status} class="ml-4 rounded-md bg-zinc-900 text-white px-2 text-lg">
                        {#each $statuses as status}
                            <option value={status.name}>{status.name}</option>
                        {/each}
                    </select>
                {:else}
                     <p class="ml-4 rounded-md bg-zinc-700 text-white px-2 text-lg">{$task.task.status}</p>
                {/if}
            </div>
            <div>
                <div class="flex flex-row w-full content-start mt-4 overflow-visible static">
                    <p class="text-white font-bold italic text-3xl">Assigned</p>
                    {#if $task.persons.findIndex(v => v.id === $workspace.user.Id) === -1
                    }
                        <button class="text-green-500 text-4xl hover:bg-zinc-700 rounded-lg p-1 mx-4" on:click={selfAssign}>
                            <iconify-icon icon="iconamoon:do-redo"/>
                        </button>
                    {:else}
                        <button class="text-red-500 text-4xl hover:bg-zinc-700 rounded-lg p-1 mx-4" on:click={selfDismiss}>
                            <iconify-icon icon="iconamoon:do-undo-fill"/>
                        </button>
                    {/if}
                        {#if $workspace.isAdmin}
                        <button class="text-yellow-400 text-4xl hover:bg-zinc-700 rounded-lg p-1 mx-2" on:click={changeDropdown}>
                            <iconify-icon icon="fluent:person-add-24-filled"/>
                        </button>
                        {#if showPersonDropdown}
                            <ul transition:slide  class="absolute ml-64 bg-zinc-700 px-2">
                                {#each $persons.filter(v => $task.persons.findIndex(t => t.id === v.id) === -1) as person}
                                    <li class="px-2 text-white text-lg hover:bg-slate-400" on:keydown on:click={() => {showPersonDropdown = false; Assign(person)}}>
                                        {person.name}
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    {/if}
                </div>
                <ul class="flex flex-col">
                    {#each $task.persons as person}
                        <li>
                            <div class="flex flex-row justify-between p-1 items-center">
                                {#if person.role === "Admin"}
                                    <p class="text-sky-400 text-xl">{person.name}</p>
                                {:else}    
                                    <p class="text-amber-200 text-lg">{person.name}</p>
                                {/if}
                                {#if $workspace.isAdmin}
                                    <button on:click={() => {Dismiss(person)}}>
                                        <iconify-icon icon="fluent:dismiss-circle-32-regular" class="text-3xl text-red-500 hover:bg-zinc-700 rounded-lg p-1"/>
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <p class="w-full mt-4 text-white font-bold italic text-3xl text-center">Comments</p>
            <div class="w-full flex flex-row justify-center items-start">
                <div contenteditable="true" class="text-white text-lg font-serif rounded-3xl border-2 border-sky-600 w-10/12 py-2 px-4 mt-4" bind:innerText={content}></div>
                <button class="mt-4 ml-2 text-sky-500 text-4xl items-center pt-1" on:click={() => writeComment($task.task.id)}>
                    <iconify-icon icon="mdi:send-circle-outline"/>
                </button>
            </div>
            <div class="w-full mt-4 flex flex-col justify-center">
                {#each $comments as c}
                    {#if c.person_id === $workspace.user.Id}
                        <div class="flex flex-row justify-end items-start mt-2">
                            <div contenteditable="false" class="text-white text-lg font-serif rounded-3xl border-2 border-sky-700 bg-sky-700 py-2 px-4">
                                {c.content}
                            </div>
                            <button on:click={() => deleteComment($task.task.id, c.id)}>
                                <iconify-icon icon="material-symbols:delete" class="text-red-600 text-3xl"/>
                            </button>
                        </div>
                        <div class="flex flex-row justify-end">
                            <p class="text-base text-white mr-4">You</p>
                            <p class="text-base text-green-400">{c.created_at.slice(0,10)}</p>
                        </div>
                    {:else}
                        <div class="flex flex-row justify-start items-start mt-2">
                            {#if $workspace.isAdmin}
                                <button on:click={() => deleteComment($task.task.id, c.id)}>
                                    <iconify-icon icon="material-symbols:delete" class="text-red-600 text-3xl"/>
                                </button>
                            {/if}
                            <div contenteditable="false" class="text-white text-lg font-serif rounded-3xl border-2 border-sky-700 bg-sky-700 py-2 px-4">
                                {c.content}
                            </div>
                        </div>
                        <div class="flex flex-row justify-start">
                            <p class="text-base text-white mr-4">{c.person}</p>
                            <p class="text-base text-green-400">{c.created_at.slice(0,10)}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

<section class="flex flex-row content-start items-start h-full w-full">
    <nav class="h-screen bg-zinc-800 border-black border-2 flex flex-col items-start min-w-[228px] max-w-[228px]">
        <button class="side-nav-button text-gray-400" on:click={() => addGroup($workspace.data.info.id)}>
            <iconify-icon icon="icon-park-outline:add" class="text-3xl pr-1"/>
            <p class="text-xl">Add Group</p>
        </button>
        <button class="side-nav-button text-gray-400" on:click={() => openInfo = !openInfo}>
            <iconify-icon icon="ep:info-filled" class="text-3xl"/>
            <p class="text-xl">Workspace Info</p>
        </button>
        <button class="side-nav-button text-gray-400" on:click={() => showTeam = !showTeam}>
            <iconify-icon icon="fluent:people-team-24-filled" class="text-3xl"/>
            <p class="text-xl">Team</p>
        </button>
        <button class="side-nav-button text-gray-400" on:click={() => leaveWS()}>
            <iconify-icon icon="icomoon-free:exit" class="text-3xl pl-1"/>
            <p class="text-xl">Exit Workspace</p>
        </button>
        {#if $workspace.isAdmin}
            <button class="side-nav-button text-lime-600" on:click={() => showInvitation = true}>
                <iconify-icon icon="mdi:email-plus" class="text-3xl"/>
                <p class="text-xl">Send Invitation</p>
            </button>
            <button class="side-nav-button text-amber-400" on:click={() => ChangeWSStatus()}>
                <iconify-icon icon="uiw:warning" class="text-2xl px-1"/>
                <p class="text-xl text-end ">Make {#if $workspace.data.info.isActive}
                    Inactive
                {:else}
                    Active
                {/if}</p>
            </button>
            <button class="side-nav-button text-red-600" on:click={() => DeleteWS()}>
                <iconify-icon icon="material-symbols:delete-sharp" class="text-3xl text-red-600"/>
                <p class="text-xl">Delete Workspace</p>
            </button>
        {/if}
    </nav>
    <Group bind:group={$workspace.data.groups} bind:ws_id={$workspace.data.info.id} on:opentask={showTask} on:move={openMove}/>
</section>

{#if openInfo}
    <WorkspaceInfo bind:info={$workspace.data.info} isAdmin={$workspace.isAdmin} on:close={closeInfo} on:save={SaveInfo}/>
{/if}

{#if showTeam}
    <TeamList bind:team={$persons} isAdmin={$workspace.isAdmin} you={$workspace.user.Id} ws={$workspace.data.info.id} on:close={closeTeam}/>
{/if}

{#if showMoveTask && taskToMove !== -1}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => {showMoveTask = false}}>
        <div class="mx-auto my-52 max-w-sm bg-zinc-800 rounded-lg shadow-xl p-4 flex flex-col items-start border-4 border-black" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-white font-extrabold text-center text-2xl p-2">Select group to move</h2>
            <select class="bg-zinc-800 text-white p-2" bind:value={selected}>
                {#each $workspace.data.groups.filter(v => v.id !== groupFrom) as group}
                    <option value={group.id} class="bg-black text-white">
                        {group.name}
                    </option>
                {/each}
            </select>
            <div class="flex flex-row w-full justify-around">
                <button on:click={() => moveTask(selected)} class="p-2 bg-green-700 text-xl rounded-md hover:bg-green-800 text-white mt-4 align-middle w-40">Move</button>
                <button on:click={() => showMoveTask = false} class="p-2 bg-red-700 text-xl rounded-md hover:bg-red-800 text-white mt-4 align-middle w-40">Back</button>
            </div>
        </div>
    </div>
{/if}

{#if showChooseNext}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => showChooseNext = false}>
        <div class="mx-auto my-52 max-w-sm bg-zinc-800 rounded-lg shadow-xl px-6 py-8 flex flex-col items-start" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-white font-extrabold text-center text-2xl p-2">Choose the next administrator</h2>
            <select class="bg-zinc-800 text-white p-2 text-lg my-4" bind:value={selectedPerson}>
                {#each $persons.filter(v => v.id !== $workspace.user.Id) as p}
                    <option value={p.id} class="bg-black text-white font-serif text-lg">
                        {p.name}
                    </option>
                {/each}
            </select>
            <div class="flex flex-row w-full justify-around">
                <button on:click={() => chooseNextAdminAndLeave(selectedPerson)} class="p-2 bg-green-700 text-xl rounded-md hover:bg-green-800 text-white mt-4 align-middle w-40">Accept</button>
                <button on:click={() => showChooseNext = false} class="p-2 bg-red-700 text-xl rounded-md hover:bg-red-800 text-white mt-4 align-middle w-40">Decline</button>
            </div>
        </div>
    </div>
{/if}

{#if showInvitation}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => showInvitation = false}>
        <div class="mx-auto my-52 max-w-sm bg-zinc-800 rounded-lg shadow-xl px-6 py-8 flex flex-col items-start" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-white font-extrabold text-center text-3xl p-2">Send Invitation</h2>
            <label for="emailField" class="text-xl text-white font-serif mt-4 mb-2">Email of Invitee:</label>
            <input id="emailField" type="email" class="bg-zinc-700 text-xl p-2 text-white rounded-md" bind:value={emailToInvite}/>
            <div class="flex flex-row w-full justify-around mt-4">
                <button on:click={() => sendInvite()} class="p-2 bg-green-700 text-xl rounded-md hover:bg-green-800 text-white mt-4 align-middle w-40">Send</button>
                <button on:click={() => showInvitation = false} class="p-2 bg-red-700 text-xl rounded-md hover:bg-red-800 text-white mt-4 align-middle w-40">Decline</button>
            </div>
        </div>
    </div>
{/if}