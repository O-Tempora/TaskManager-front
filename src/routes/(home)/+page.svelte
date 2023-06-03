<script>
    import {user} from "../store";
    import "../../app.postcss";
    import "iconify-icon";
    import WorkspaceList from "../../lib/WorkspaceList.svelte";

    $: isLoggedIn = ($user === null | "" | " ")? false:true;
</script>

<div class="my-8 mx-12">
    {#if isLoggedIn}
        <div class="flex flex-row">
            <p class="text-black font-serif text-2xl font-extrabold align-baseline">Your Workspaces</p>
            <iconify-icon icon="mdi:create-new-folder-outline" class="text-4xl mx-2 px-2 mb-2 hover:bg-slate-200"></iconify-icon>
        </div>    
        <WorkspaceList/>
    {/if}
</div>