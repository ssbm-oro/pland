
import crypto from 'crypto';
import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

type TSessionID = string;
type FullUser = { user:APIUser, token:RESTPostOAuth2AccessTokenResult };

const sessionUsers = new Map<TSessionID, FullUser>();
const sessionUserTimeouts = new Map<TSessionID, NodeJS.Timeout>();

export function setSession(userData: APIUser, tokenGrantData: RESTPostOAuth2AccessTokenResult) {

    // Creating a new session ID that will be used as a cookie to authenticate the user in 
    const newSessionID: TSessionID = crypto.randomBytes(32).toString('hex');
    const fullUser: FullUser = { user:userData, token:tokenGrantData };

    sessionUsers.set(newSessionID, fullUser);

    const timeout = setTimeout(() => {
        deleteSession(newSessionID)
    }, 1000 * 60 * 10) //  10 minutes

    sessionUserTimeouts.set(newSessionID, timeout);

    return newSessionID as TSessionID;
}

export function fetchSession(sessionId: TSessionID) {
    refreshTimeout(sessionId);

    return sessionUsers.get(sessionId);
}

export function fetchClientSession(sessionId: TSessionID) {
    refreshTimeout(sessionId);

    const session = sessionUsers.get(sessionId);
    if (!session) return null;

    return session.user;
}

function refreshTimeout(sessionId: string) {
    if (sessionUserTimeouts.has(sessionId)) {
        sessionUserTimeouts.get(sessionId)?.refresh();
    }
    else {
        const timeout = setTimeout(() => {
            deleteSession(sessionId);
        }, 1000 * 60 * 10); //  10 minutes
        sessionUserTimeouts.set(sessionId, timeout);
    }
}

export function deleteSession(sessionId: TSessionID) {
    sessionUsers.delete(sessionId);
}

export function updateSession(sessionId: TSessionID, userData: APIUser, tokenGrantData: RESTPostOAuth2AccessTokenResult) {
    refreshTimeout(sessionId);
    const fullUser: FullUser = { user:userData, token:tokenGrantData };
    sessionUsers.set(sessionId, fullUser);

    return sessionId as TSessionID;
}