import type { APIUser } from 'discord-api-types/payloads';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/rest';

export type TSessionID = string;

export type FullUser = RESTPostOAuth2AccessTokenResult & APIUser;