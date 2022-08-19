import { error, json, type RequestHandler } from '@sveltejs/kit';
import { fetchSession } from '$lib/utils/sessionHandler';
import type { APIUser } from 'discord-api-types/v10';
import cookie from 'cookie';

interface IBody {
    sessionId: string;
}

export const POST: RequestHandler = async ( { request} ) => {
    let cookies = cookie.parse(request.headers.get('cookie') || '')
    let sessionId = cookies['session_id'];
    if (!sessionId) throw error(400, 'Property "sessionId" is required');

    const session = fetchSession(sessionId);
    if (!session) throw error(400, 'Invalid session.');

    const {...apiUser}: APIUser = session;

    return json(apiUser);
}