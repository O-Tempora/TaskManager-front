<script>
    import {user} from "../store";
    import "../../app.postcss";
    import "iconify-icon";
    import WorkspaceList from "../../lib/WorkspaceList.svelte";
    import WorkspaceModal from "../../lib/WorkspaceModal.svelte";

    $: isLoggedIn = ($user === null | "" | " ")? false:true;

    let showWsModal = false;
    let show = () =>{
        showWsModal = true;
    }
    let close = () =>{
        showWsModal = false;
    }
</script>

<WorkspaceModal bind:show={showWsModal} on:close={close}/>
<div class="my-8 mx-12">
    {#if isLoggedIn}
        <div class="flex flex-row">
            <p class="text-black font-serif text-2xl font-extrabold content-end items-end">Your Workspaces</p>
            <button on:click={show} class="mx-2">
                <iconify-icon icon="mdi:create-new-folder-outline" class="text-4xl hover:bg-slate-200"/>
            </button>
        </div>    
        <WorkspaceList/>
    {/if}
</div>