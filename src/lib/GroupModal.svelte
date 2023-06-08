<script>
    import { createEventDispatcher } from "svelte";
    import ColorPicker from "svelte-awesome-color-picker";

    export let show = true;
    export let color;
    export let name;
    let hex = "";
    $: color = hex;
    
    const dispatch = createEventDispatcher();
    const close = () =>{
        hex = "";
        show = false;
        dispatch('close');
    };
    const saveAndClose = () =>{
        show = false;
        dispatch('close');
    };
</script>

{#if show}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keyup on:click={() => close()}>
        <div class="mx-auto my-52 max-w-sm bg-slate-900 rounded-lg shadow-xl p-4 flex flex-col items-start border-4 border-black" on:keyup on:click|stopPropagation>
            <h2 class="w-full text-[#ffc13b] font-extrabold text-center text-2xl p-2">Edit Group</h2>
            <label for="newName" class="text-xl text-[#ff6e40] font-bold py-2">Name:</label>
            <input type="text" id="newName" bind:value={name} class="bg-[#F1EAD4] text-[#1e3d59] text-xl rounded-lg p-2">
            <p class="text-xl text-[#ff6e40] font-bold py-2">Color:</p>
            <div class=" text-[#ff6e40]">
                <ColorPicker bind:hex/>
            </div>
            <button on:click={() => saveAndClose()} class="p-2 bg-sky-700 text-xl rounded-md hover:bg-sky-600 text-[#F1EAD4] mt-4 w-full align-middle">Save</button>
        </div>
    </div>
{/if}