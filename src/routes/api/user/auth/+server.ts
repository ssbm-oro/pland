import { setSession } from '$lib/utils/sessionHandler';
import cookie from 'cookie';
import { error, type RequestHandler } from '@sveltejs/kit';
import type { APIUser, APIGuild, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2AccessTokenURLEncodedData } from 'discord-api-types/v10'
import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from '$env/static/public';
import { env } from '$env/dynamic/public';


export const GET: RequestHandler = async ( { url, setHeaders } ) => {
    const code = url.searchParams.get('code');
    if (!code) throw error(400, 'No code provided.');

    const authData: RESTPostOAuth2AccessTokenURLEncodedData = {
        client_id: PUBLIC_DISCORD_OAUTH_CLIENT_ID,
        client_secret: DISCORD_OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: env.PUBLIC_DISCORD_REDIRECT_URI,
    };

    try {
        // Get the authentication object using the user's code
        const authRes = await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(authData as unknown as Record<string, string>)
        });

        const Grantdata: RESTPostOAuth2AccessTokenResult = await authRes.json();

        // Get the user's data using the access token
        const UserRes = await fetch(`https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${Grantdata.access_token}`,
            }
        });

        const UserData: APIUser = await UserRes.json();

        // Get the guilds the user is in
        const UserGuildRes = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${Grantdata.access_token}`,
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const UserGuildData: APIGuild[] = await UserGuildRes.json();

        // Create new session for the user
        const SessionID = setSession(UserData, Grantdata);

        // Optionally, you can upsert the user in the DB here

        // Redirect the user and set the session cookie
        setHeaders({
            'Set-Cookie': cookie.serialize('session_id', SessionID as string, {
                path: '/',
                httpOnly: true,
                sameSite: false,
                secure: true,
                maxAge: Grantdata.expires_in
            })});
        setHeaders({'location': '/'});
        return new Response('', {status: 302 });

    } catch (error) {
        console.log(error);
        return new Response(undefined, { status: 302 })
    };
}