import { json } from '@sveltejs/kit';
import { fetchSession } from '$lib/utils/sessionHandler';
import type { RequestHandler } from '@sveltejs/kit';
import type { APIUser } from 'discord-api-types/payloads/v10';
import cookie from 'cookie';

interface IBody {
    sessionId: string;
}

export const POST: RequestHandler = async ( { request} ) => {
    let cookies = cookie.parse(request.headers.get('cookie') || '')
    let sessionId = cookies['session_id'];
    if (!sessionId) return json({ error: 'Property "sessionId" is required.' }, {
        status: 400
    });

    const session = fetchSession(sessionId);
    if (!session) return json({ error: 'Invalid session.' }, {
        status: 400
    });

    return new Response(JSON.stringify(session as APIUser));
}