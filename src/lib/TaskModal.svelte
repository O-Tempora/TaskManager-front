<script>
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from 'svelte/transition';
    export let descr;
    export let startAt = "2006-01-02";
    export let finishAt = "2006-01-02";
    export let show;
    const dispatch = createEventDispatcher();
    const close = () =>{
        show = false;
        dispatch('close');
    }

    // let d1 = new Date();
    // let d2 = new Date();
    // // $: d1 = new Date(parseInt(startAt.slice(0, 4)), parseInt(startAt.slice(5, 7)) - 1, parseInt(startAt.slice(8)));
    // // $: d2 = new Date(parseInt(finishAt.slice(0, 4)), parseInt(finishAt.slice(5, 7)) - 1, parseInt(finishAt.slice(8)));
    // $:{
    //     d1.setFullYear(parseInt(startAt.slice(0, 4)), parseInt(startAt.slice(5, 7)) - 1, parseInt(startAt.slice(8)))
    // }
    // $:{
    //     d2.setFullYear(parseInt(finishAt.slice(0, 4)), parseInt(finishAt.slice(5, 7)) - 1, parseInt(finishAt.slice(8)))
    //     //console.log(d2)
    // }
    // //$: console.log(d1, d2)
    // //$: {startAt = ca; finishAt = fa}
</script>

{#if show}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" on:keydown on:click={() => close()}>
        <!-- <div class="mx-auto my-52 max-w-xl bg-[#1e3d59] rounded-lg shadow-xl p-4 flex flex-col items-start border-4 border-black" on:keydown on:click|stopPropagation> -->
        <div in:fly="{{duration:500, x: -200}}" class="mx-auto w-96 bg-[#1e3d59] rounded-lg shadow-xl p-4 flex flex-col items-start border-4 border-black" on:keydown on:click|stopPropagation>
            <h2 class="w-full text-[#ffc13b] font-extrabold text-center text-2xl p-2">Task Info</h2>
            <label for="newDescr" class="text-xl text-[#ff6e40] font-bold py-2">Description:</label>
            <textarea type="text" id="newDescr" bind:value={descr} class="bg-[#F1EAD4] text-[#1e3d59] text-xl rounded-lg p-2 w-full resize h-52"></textarea>
            <div class="flex flex-row justify-between w-full">
                <div>
                    <p class="text-xl text-[#ff6e40] font-bold py-2">Start At:</p>
                    <input type="date" bind:value={startAt} class="my-1 text-lg"/>
                </div>
                <div>
                    <p class="text-xl text-[#ff6e40] font-bold py-2">Finish At:</p>
                    <input type="date" bind:value={finishAt} class="my-1 text-lg"/>
                </div>
            </div>
            <button on:click={() => close()} class="p-2 bg-sky-700 text-xl rounded-md hover:bg-sky-600 text-[#F1EAD4] mt-4 w-full align-middle">Save</button>
        </div>
    </div>
{/if}