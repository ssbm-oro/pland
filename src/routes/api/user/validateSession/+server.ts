import { error, json, type RequestHandler } from '@sveltejs/kit';
import { fetchClientSession } from '$lib/utils/sessionHandler';
import cookie from 'cookie';

export const POST: RequestHandler = async ( { request} ) => {
    const cookies = cookie.parse(request.headers.get('cookie') || '')
    const sessionId = cookies['session_id'];
    if (!sessionId) throw error(400, 'Property "sessionId" is required');

    const user = fetchClientSession(sessionId);
    if (!user) throw error(400, 'Invalid session.');

    return json(user);
}