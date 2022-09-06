import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchSession, updateSession } from '$lib/utils/sessionHandler';
import type { APIUser, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2RefreshTokenURLEncodedData } from 'discord-api-types/v10';
import cookie from 'cookie';
import log from 'loglevel';
import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from '$env/static/public';

export const POST: RequestHandler = async ( { request} ) => {

    const cookies = cookie.parse(request.headers.get('cookie') || '')
    const sessionId = cookies['session_id'];
    if (!sessionId) throw error(400, 'Property "sessionId" is required');

    const session = fetchSession(sessionId);
    if (!session) throw error(400, 'Invalid session.');

    const refreshData: RESTPostOAuth2RefreshTokenURLEncodedData = {
        'client_id': PUBLIC_DISCORD_OAUTH_CLIENT_ID,
        'client_secret': DISCORD_OAUTH_CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': session.token.refresh_token
    };

    try {
        // Get the authentication object using the user's code
        const AuthRes = await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(refreshData as unknown as Record<string, string>),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const GrantData : RESTPostOAuth2AccessTokenResult = await AuthRes.json();

        // Get the user's data using the access token
        const UserRes = await fetch(`https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${GrantData.access_token}`,
            }
        });

        const UserData: APIUser = await UserRes.json();

        updateSession(sessionId, UserData, GrantData);

        // update the session cookie
        return(new Response(null,{
            headers: {
                'Set-Cookie': cookie.serialize('session_id', sessionId as string, {
                    path: '/',
                    httpOnly: true,
                    sameSite: false,
                    secure: true,
                    maxAge: GrantData.expires_in
                }),
            }
        }));
    }
    catch (error) {
        log.error(error);
        return new Response(undefined, { status: 302 })
    }
}