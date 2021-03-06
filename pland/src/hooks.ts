import { fetchSession } from '$lib/utils/sessionHandler';
import type { Handle, GetSession } from '@sveltejs/kit';
import cookie from 'cookie';
import dotenv from 'dotenv';

dotenv.config();

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	if (cookies['session_id']) {
		const session = fetchSession(cookies['session_id']);

		if (session) {
			event.locals.user = { id: cookies['session_id'] };
			return await resolve(event);
		}
	}

	event.locals.user = null;
	return await resolve(event);
};

export const getSession: GetSession = (request) => {
	if (request?.locals?.user) return request.locals.user;

	return {id: null};
};