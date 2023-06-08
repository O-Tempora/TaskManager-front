<script>
    export let data;
    console.log(data)
</script>

<section>
    <div class="min-w-[1800px] max-w-[1800px] content-start items-start justify-start">
        {#each data.data as ws}
            <details class="m-4 p-2 border-2 border-zinc-500 bg-zinc-200">
                <summary class="text-3xl font-serif font-bold">{ws.ws_name}</summary>
                {#each ws.groups as group}
                    <details class="ml-8 p-2">
                        <summary class="text-2xl">{group.group_name}</summary>
                        <div class="grid grid-cols-5 gap-y-12 mt-2 w-full ml-8">
                            {#each group.tasks as task}
                                <div class="personal-div">
                                    <div class="w-full flex flex-row justify-between px-4 py-2">
                                        <p class="line-clamp-1 text-black font-bold font-serif">{task.createdAt.slice(0, 10)}</p>
                                        <p class="line-clamp-4 text-black break-all font-extrabold text-l font-serif">{task.status}</p>
                                    </div>
                                    <p class="px-4 py-2 line-clamp-4 text-lg text-stone-900 w-full font-serif">{task.description}</p>
                                    <div class="w-full flex flex-row items-center justify-center px-4 py-2">
                                        <p class="line-clamp-1 text-black font-bold font-serif">
                                            <span class="text-green-700">{task.startAt.slice(0, 10)}</span> -- <span class="text-red-700">{task.finishAt.slice(0, 10)}</span>
                                        </p>
                                    </div>
                                    {#if new Date(task.finishAt) < new Date()}
                                        <p class="text-red-700 break-all font-extrabold text-lg font-serif mx-4 mb-2">LATE</p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </details>
                {/each}
            </details>
        {/each}
    </div>
</section>