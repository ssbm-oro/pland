<script lang="ts">
    import type { PageData } from './$types'
    import { GradientHeading } from '@brainandbones/skeleton'


    export let data: PageData;
    $: user = data.user;

    const discord_avatar_uri = `https://cdn.discordapp.com/avatars/$userid/$useravatar.png`
</script>

<GradientHeading>Welcome to pland</GradientHeading>
<br/>

{#if !user}
    <p>Please log in if you wanna roll seeds. 🔐</p>
    <p>You can help me <a class="text-primary-500" href="/logictest">test the logic</a> without logging in if you want.</p>
{:else}
    <h2>You are {user.username}</h2>
    {#if user.avatar}
        <img src='{discord_avatar_uri.replace('$userid', user.id).replace('$useravatar',user.avatar)}' alt="{user.username}'s avatar"/>
    {/if}
    <p>This website is best viewed in a resolution of 640x480 or greater.</p>
{/if}