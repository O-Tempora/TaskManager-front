<script>
    import "../../app.postcss";
    import axios from 'axios';
    let email = '';
    let name = '';
    let phone = '';
    let password = '';

    const signUp = ()=>{
         axios.post(
            "http://localhost:5192/signup",
            {
                email: email,
                name: name,
                phone: phone,
                password: password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
         )
         .then((res)=>{
            if(res.status == 201){
                //return res.data;
                console.log("Signed up successfully");
                console.log(res);
                window.location.replace("http://localhost:5173");
                return;
            }
         })
         .catch(err => window.alert(err))
    }
</script>

<section class="flex flex-col items-center justify-center mx-auto md:h-screen">
    <div class="bg-slate-900 rounded-xl p-4 w-300 mb-44">
        <h2 class="text-white font-extrabold text-center text-3xl p-2 font-serif">Sign Up</h2>
        <form on:submit|preventDefault={signUp}>
            <div class="flex flex-col">
                <label for="email" class="auth-label">Your email</label>
                <input type="email" id="email" bind:value={email} class="auth-input"/>
            </div>
            <div class="flex flex-col">
                <label for="name" class="auth-label">Username</label>
                <input type="text" id="name" bind:value={name} class="auth-input"/>
            </div>
            <div class="flex flex-col">
                <label for="phone" class="auth-label">Phone number</label>
                <input type="tel" id="phone" bind:value={phone} class="auth-input"/>
            </div>
            <div class="flex flex-col">
                <label for="password" class="auth-label">Password</label>
                <input type="password" id="password" bind:value={password} class="auth-input"/>
            </div>
            <button type="submit" class="auth-button">Sign Up</button>
        </form>
    </div>
</section>