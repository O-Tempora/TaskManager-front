<script>
    import "../../app.postcss";
    import axios from "axios";
    import user from "../store";
    import { creds } from "../creds"

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
</script>

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
            {#await getp}
                <div></div>
            {:then} 
                {#if $creds.IsMaintainer}
                    <li class="inline-block">
                        <a href="/maintainer?usr={$user}" class="home-href text-orange-500">Maintainer</a>
                    </li>
                {/if}
            {/await}
        {/if}
    </ul>
</nav>
<slot/>