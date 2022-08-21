import { fetchSession } from '$lib/utils/sessionHandler';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	if (cookies['session_id']) {
		const session = fetchSession(cookies['session_id']);

		if (session) {
			event.locals.session = { id: cookies['session_id'] };
			event.locals.user = session.user;

			return await resolve(event);
		}
	}

	event.locals.session = null;
	event.locals.user = null;
	return await resolve(event);
};