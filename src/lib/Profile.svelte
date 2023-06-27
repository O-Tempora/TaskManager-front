<script>
    import 'iconify-icon';
    import axios from 'axios';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from "svelte"
    export let user
    console.log(user)

    const dispatch = createEventDispatcher();
    const close = () =>{
        dispatch('close');
    }
    const save = async () =>{
        await axios.put(
            `http://localhost:5192/person/${user.Id}`,
            {
                id: user.Id,
                phones: user.Phone,
                name: user.Login,
                email: user.Email,
                settings: "",
                password: ""
            }
        )
        dispatch('close');
    }
</script>

<div class="fixed top-0 right-0 bg-slate-900 h-full w-[620px] flex flex-col p-4 items-center" transition:fly={{x: '100%'}}>
    <div class="w-full flex flex-row justify-between">
        <button class="text-white text-3xl hover:bg-zinc-700 rounded-lg p-2 flex flex-row items-center" on:click={() => save()}>
            <iconify-icon icon="fluent-mdl2:save"/>
            <p class="ml-2">Edit</p>
        </button>
        <button class="text-white text-4xl hover:bg-zinc-700 rounded-lg p-1" on:click={() => close()}>
            <iconify-icon icon="material-symbols:close"/>
        </button>
    </div>

    <p class="w-full text-4xl text-lime-200 text-center overflow-auto mt-4">Your Profile</p>

    <div class="min-w-[560px] max-w-[560px] flex flex-col justify-center mt-4">
        <div class="flex flex-col mx-4 my-2">
            <label for="name" class="text-white text-xl font-bold">Name:</label>
            <div id="name" contenteditable="true" class="text-white text-xl font-serif my-2 p-2 rounded-lg border-2 border-sky-800" bind:textContent={user.Login}></div>
        </div>
        <div class="flex flex-col mx-4 my-2">
            <label for="email" class="text-white text-xl font-bold">Email:</label>
            <div id="email" contenteditable="true" class="text-white text-xl font-serif my-2 p-2 rounded-lg border-2 border-sky-800" bind:textContent={user.Email}></div>
        </div>
        <div class="flex flex-col mx-4 my-2">
            <label for="email" class="text-white text-xl font-bold">Phone:</label>
            <div id="email" contenteditable="true" class="text-white text-xl font-serif my-2 p-2 rounded-lg border-2 border-sky-800" bind:textContent={user.Phone}></div>
        </div>
    </div>
</div>