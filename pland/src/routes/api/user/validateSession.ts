import { fetchSession } from '$lib/utils/sessionHandler';
import type { RequestHandler } from '@sveltejs/kit';
import type { IUserData } from 'src/interfaces';

interface IBody {
    sessionId: string;
}

export const POST: RequestHandler = async ( { request} ) => {

    const body: IBody = await request.json();
    if (!body.sessionId) return { status: 400, body: { error: 'Property "sessionId" is required.' } };

    const session = fetchSession(body.sessionId);
    if (!session) return { status: 400, body: { error: 'Invalid session.' } };

    return {
        status: 200,
        body: JSON.stringify(session as IUserData)
    };
}