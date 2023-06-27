<script>
    import "../../app.postcss";
    import axios from "axios";
    import user from "../store";
    import { creds } from "../creds"
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from "svelte"
    import Invitations from "../../lib/Invitations.svelte";
    import Profile from "../../lib/Profile.svelte";

    $: isLoggedIn = ($user === null)? false:true;

    let getPerson = async () =>{
        try{
            console.log($user)
            const res = await axios.get(
                `http://localhost:5192/person/byToken`,{
                    headers:{
                        "Authorization": "Bearer " + $user
                    }
                }
            );
            const p = await res.data;
            creds.set(p)
            console.log($creds)
        } catch(e){
            console.log(e);
        }
    }
    let getp = getPerson()

    let showInvites = false;
    let closeInv = () =>{
        showInvites = false
    }

    let showProfile = false;
    let closeProfile = () =>{
        showProfile = false
    }
</script>

<nav class="nav-bar justify-center">
    <ul class="h-full">
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
            {#await getp}
                <p></p>
            {:then} 
                <li class="inline-block h-full">
                    <button class="text-white font-serif text-xl font-semibold px-4 hover:bg-slate-800 items-center" on:click={()=> showProfile = true}>
                        Profile
                    </button>
                </li>
                <li class="inline-block h-full">
                    <button class="text-white font-serif text-xl font-semibold px-4 hover:bg-slate-800 items-center" on:click={()=> showInvites = true}>
                        Invitations
                    </button>
                </li>
                {#if $creds.IsMaintainer}
                    <li class="inline-block">
                        <a href="/maintainer?usr={$user}" class="home-href text-orange-500">Maintainer</a>
                    </li>
                {/if}
            {/await}
        {/if}
    </ul>
</nav>

{#if showInvites}
    <Invitations bind:user={$user} on:close={closeInv}/>
{/if}

{#if showProfile}
    <Profile bind:user={$creds} on:close={closeProfile}/>
{/if}

<slot/>