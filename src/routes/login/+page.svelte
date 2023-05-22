<script>
    import "../../app.postcss";
    import axios from 'axios';
    import user from "../store";
    let email = '';
    let password = '';

    const logIn = ()=>{
         axios.post(
            "http://localhost:5192/login",
            {
                email: email,
                password: password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Accept': '*/*'
                },
            },
         )
         .then((res)=>{
            if(res.status == 200){
                console.log(res);
                return res.data;
            }
         })
         .then((data)=>{
            console.log(data.accessToken);
            user.update(val => val = data.accessToken)
            window.location.replace("http://localhost:5173");
         })
         .catch(err => console.log(err))
    }
</script>

<section class="flex flex-col items-center justify-center mx-auto md:h-screen">
    <div class="bg-slate-900 rounded-xl p-4 w-300 mb-44">
        <h2 class="text-white font-extrabold text-center text-3xl p-2 font-serif">Log In</h2>
        <form on:submit|preventDefault={logIn}>
            <div class="flex flex-col">
                <label for="email" class="auth-label">Your email</label>
                <input type="email" id="email" bind:value={email} class="auth-input" placeholder="email@domain.com"/>
            </div>
            <div class="flex flex-col">
                <label for="password" class="auth-label">Password</label>
                <input type="password" id="password" bind:value={password} class="auth-input"/>
            </div>
            <button type="submit" class="auth-button">Log In</button>
        </form>
    </div>
</section>