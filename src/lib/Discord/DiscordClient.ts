import { env } from "$env/dynamic/public";
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from "$env/static/public";

export const discord_login_uri = `https://discord.com/api/oauth2/authorize?client_id=${PUBLIC_DISCORD_OAUTH_CLIENT_ID}&redirect_uri=${env.PUBLIC_DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds`;