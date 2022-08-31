<script lang="ts">
    import { Avatar } from "@brainandbones/skeleton";

    export let user: {
        username: string,
        id: string,
        avatar: string | null
    };
    export let size: string | 'md';
    export let hover: boolean | false = false;
    export let outlined: boolean | false = false;
    $: discord_avatar_uri = user && user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : undefined;
</script>


<Avatar slot="trigger" src="{discord_avatar_uri}" initials="{user.username[0]}" {outlined} {size} {hover} alt="{user.username}'s avatar."></Avatar>
