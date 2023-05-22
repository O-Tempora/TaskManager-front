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
            const resp = await axios.post("http://localhost:5192/home", {
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
            wsList.update(value => [...value, ws])
        } catch(e){
            console.log(e)
        }
    }
</script>

{#if show}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => close()}>
        <div class="mx-auto my-52 max-w-sm bg-[#1e3d59] rounded-lg shadow-xl p-4 flex flex-col items-start border-4 border-black" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-[#ffc13b] font-extrabold text-center text-2xl p-2">Create Workspace</h2>
            <label for="newName" class="text-xl text-[#ff6e40] font-bold py-2">Name:</label>
            <input type="text" id="newName" bind:value={name} class="bg-[#F1EAD4] text-[#1e3d59] text-xl rounded-lg p-2">
            <p class="text-xl text-[#ff6e40] font-bold py-2">Description:</p>
            <textarea type="text" id="newDescr" bind:value={description} class="bg-[#F1EAD4] text-[#1e3d59] text-xl rounded-lg p-2 w-full resize h-52"></textarea>
            <button on:click={() => saveAndClose()} class="p-2 bg-sky-700 text-xl rounded-md hover:bg-sky-600 text-[#F1EAD4] mt-4 w-full align-middle">Save</button>
        </div>
    </div>
{/if}