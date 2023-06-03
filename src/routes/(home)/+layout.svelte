<script>
    import "../../app.postcss";
    import WorkspaceModal from "../../lib/WorkspaceModal.svelte";
    import user from "../store";

    $: isLoggedIn = ($user === null)? false:true;

    let showWsModal = false;
    const showModal = () =>{
        showWsModal = true;
    }
    const closeModal = () =>{
        showGroupModal = false;
    }
</script>

<WorkspaceModal bind:show={showWsModal}/>
<nav class="nav-bar justify-center">
    <ul>
        <li class="inline-block">
            <a href="/login" class="home-href">LogIn</a>
        </li>
        <li class="inline-block">
            <a href="/signup" class="home-href">SignUp</a>
        </li>
        {#if isLoggedIn}
            <li class="inline-block">
                <a href="/personal?usr={$user}" class="home-href">Personal Tasks</a>
            </li>
        {/if}
    </ul>
</nav>

<slot/>