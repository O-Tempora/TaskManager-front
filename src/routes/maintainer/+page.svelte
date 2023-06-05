<script>
    import axios from 'axios';
    import 'iconify-icon';
    import { jwt } from "../jwt";

    export let data
    console.log(data)

    let showPrs = false
    let showWS = false

    let personPage = 1
    let wsPage = 1

    let getPersonPage = async () =>{
        try{
            const res = await axios.get(`http://localhost:5192/maintainer/person?page=${personPage}&take=16`,
            {
                headers:{
                    "Authorization": "Bearer " + $jwt
                }
            }
            )
            data.prs.Persons = res.data
        } catch(e){
            console.log(e)
        }
    }
    let deletePerson = async (id) =>{
        try{
            await axios.delete(`http://localhost:5192/maintainer/person/${id}`,{
                headers:{
                    "Authorization": "Bearer " + $jwt
                }
            })
            data.prs.Persons = data.prs.Persons.filter(v => v.id !== id)
        } catch(e){
            console.log(e)
        }
    }
    let getWSPage = async () =>{
        try{
            const res = await axios.get(`http://localhost:5192/maintainer/workspace?page=${wsPage}&take=16`,
            {
                headers:{
                    "Authorization": "Bearer " + $jwt
                }
            }
            )
            data.ws.WS = res.data
        } catch(e){
            console.log(e)
        }
    }
    let deleteWS = async (id) =>{
        try{
            await axios.delete(`http://localhost:5192/maintainer/workspace/${id}`,{
                headers:{
                    "Authorization": "Bearer " + $jwt
                }
            })
            data.ws.WS = data.ws.WS.filter(v => v.id !== id)
        } catch(e){
            console.log(e)
        }
    }
</script>

<section class="flex flex-row items-start h-full w-full">
    <nav class="h-screen bg-zinc-800 border-black border-2 flex flex-col items-start min-w-[200px] max-w-[200px]">
        <button class="side-nav-button text-white" on:click={() => {showPrs = true; showWS = false}}>
            <iconify-icon icon="ri:team-fill" class="text-3xl pr-1"/>
            <p class="text-xl">Persons</p>
        </button>
        <button class="side-nav-button text-white" on:click={() => {showWS = true; showPrs = false}}>
            <iconify-icon icon="ant-design:project-filled" class="text-3xl"/>
            <p class="text-xl">Workspaces</p>
        </button>
    </nav>

    {#if showPrs}
        <div class="justify-center items-center content-center">
            <div class="grid grid-cols-4 grid-rows-4 gap-y-12 mt-4 ml-8 min-w-[1500px] max-w-[1500px] min-h-[740px] max-h-[740px]">
                {#each data.prs.Persons as p}
                    <div class="flex flex-row items-start">
                        <div class="ws-div items-center">
                            <p class="py-2 px-2 line-clamp-2 text-2xl text-black font-bold font-serif">{p.name}</p>
                            <div class="flex flex-row w-full px-2">
                                <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Email: </p>
                                <p class="line-clamp-4 text-lg text-stone-900 break-all text-center ml-2">{p.email}</p>
                            </div>
                            <div class="flex flex-row w-full px-2">
                                <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Phone: </p>
                                <p class="line-clamp-4 text-lg text-stone-900 break-all text-center ml-2">{p.phones}</p>
                            </div> 
                            <div class="flex flex-row w-full px-2">
                                <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Status: </p>
                                {#if p.isMaintainer}
                                    <span class="text-lime-600 font-bold text-lg ml-2">Maintainer</span>
                                {:else}
                                    <span class="text-red-600 font-bold text-lg ml-2">User</span>
                                {/if}
                            </div>
                        </div>
                        {#if !p.isMaintainer}
                            <button on:click={() => {deletePerson(p.id)}}>
                                <iconify-icon icon="material-symbols:delete-sharp" class="text-3xl text-red-700"/>
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="flex flex-row justify-center">
                <button disabled={personPage === 1} on:click={() => {personPage--; getPersonPage()}}>
                    <iconify-icon icon="icon-park-outline:left-two" class="text-6xl"/>
                </button>
                <div contenteditable="false" bind:textContent={personPage} class="mx-16 text-6xl items-center content-center text-center"/>
                <button disabled={data.prs.Persons.length < 16} on:click={() => {personPage++; getPersonPage()}}>
                    <iconify-icon icon="icon-park-outline:right-two" class="text-6xl"/>
                </button>
            </div>
        </div>
    {/if}

    {#if showWS}
        <div class="justify-center items-center content-center">
            <div class="grid grid-cols-4 grid-rows-4 gap-y-12 mt-4 ml-8 min-w-[1500px] max-w-[1500px] min-h-[740px] max-h-[740px]">
                {#each data.ws.WS as ws}
                    <div class="flex flex-row items-start">
                        <div class="ws-div items-center">
                            <p class="py-2 px-2 line-clamp-2 text-2xl text-black font-bold font-serif">{ws.name}</p>
                            <p class="line-clamp-4 text-lg text-stone-900 text-left ml-2">{ws.description}</p>
                            <div class="flex flex-row w-full px-2">
                                <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Created: </p>
                                <p class="line-clamp-4 text-lg text-stone-900 break-all text-center ml-2">{ws.createdAt.slice(0, 10)}</p>
                            </div>
                            <div class="flex flex-row w-full px-2">
                                <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Status: </p>
                                {#if ws.isActive}
                                    <span class="text-lime-600 font-bold text-lg ml-2">Active</span>
                                {:else}
                                    <span class="text-red-600 font-bold text-lg ml-2">Inactive</span>
                                {/if}
                            </div>
                            {#if ws.closed_at !== null} 
                                <div class="flex flex-row w-full px-2">
                                    <p class="line-clamp-4 text-lg text-stone-900 break-all font-bold text-center">Closed: </p>
                                    <p class="line-clamp-4 text-lg text-stone-900 break-all text-center ml-2">{ws.closed_at.slice(0, 10)}</p>
                                </div>
                            {/if}
                        </div>
                        <button on:click={() => {deleteWS(ws.id)}}>
                            <iconify-icon icon="material-symbols:delete-sharp" class="text-3xl text-red-700"/>
                        </button>
                    </div>
                {/each}
            </div>
            <div class="flex flex-row justify-center">
                <button disabled={wsPage === 1} on:click={() => {wsPage--; getWSPage()}}>
                    <iconify-icon icon="icon-park-outline:left-two" class="text-6xl"/>
                </button>
                <div contenteditable="false" bind:textContent={wsPage} class="mx-16 text-6xl items-center content-center text-center"/>
                <button disabled={data.ws.WS.length < 16} on:click={() => {wsPage++; getWSPage()}}>
                    <iconify-icon icon="icon-park-outline:right-two" class="text-6xl"/>
                </button>
            </div>
        </div>
    {/if}
</section> 