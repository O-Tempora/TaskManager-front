<script>
    import { createEventDispatcher } from "svelte"
    import { wsList } from "../routes/wsList";
    import user from "../routes/store";
    import axios from "axios";
    export let show = true;

    let name = "";
    let description = "";
    const dispatch = createEventDispatcher();
    const close = () =>{
        show = false;
        dispatch('close');
    }
    const saveAndClose = () =>{
        createWS(name, description);
        show = false;
        dispatch('close');
    }

    let createWS = async (name, description) =>{
        try{
            const resp = await axios.post("http://localhost:5192/workspace", {
                    name: name,
                    description: description,
                }, {
                    headers:{
                        "Authorization": "Bearer " + $user,
                    },
                }
            );
            const ws = resp.data;
            console.log(ws);
            wsList.update(value => [ws, ...value])
        } catch(e){
            console.log(e)
        }
    }
</script>

{#if show}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => close()}>
        <div class="mx-auto my-52 max-w-sm bg-black rounded-lg shadow-xl px-6 py-8 flex flex-col items-start" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-white font-extrabold text-center text-3xl p-2">Create Workspace</h2>
            <label for="newName" class="text-xl text-lime-400 font-bold py-2">Name:</label>
            <input type="text" id="newName" bind:value={name} class="bg-white text-black text-xl rounded-lg p-2 w-full">
            <p class="text-xl text-red-400 font-bold py-2 mt-2">Description:</p>
            <textarea type="text" id="newDescr" bind:value={description} class="bg-white text-black text-xl rounded-lg p-2 w-full resize h-52"></textarea>
            <button on:click={() => saveAndClose()} class="p-2 bg-zinc-600 text-xl rounded-md hover:bg-zinc-700 text-white mt-4 w-full align-middle">Save</button>
        </div>
    </div>
{/if}