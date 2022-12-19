export const API_RESPONSE_STATUS = {
    ERROR: 'error',
    SUCCESS: 'success',
};

export const API_RESPONSE_MESSAGE = {
    RESOURCE_EXISTS: 'Resource already exists',
    RESOURCE_NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'Intener server error, try again later',
};

export const API_CODE_TYPE = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const FILE_TYPES = {
    ARTICLE: 'application/pdf',
    AUDIO: 'audio',
    VIDEO: 'video',
    IMAGE: 'image',
};

export const CENTRE_TYPES = {
    CRISIS: 'crisis',
    DISPATCH: 'dispatch',
};

export const USERS_TYPE = {
    PLATFORM_OWNER: 'platform_owner',
    PLATFORM_ADMINISTRATOR: 'platform_administrator',
    HERO: 'hero',
    CENTRE_ADMIN: 'centre_admin',
    CENTRE_OPERATOR: 'centre_operator',
};

export const USER_ACTIONS = {
    CHANGE_ACCOUNT_PASSWORD: 'change_account_password',
};

export const MEDIA_TYPE = {
    LIVESTREAM: 'livestream',
    POST: 'post',
    IMAGE: 'image',
    VIDEO: 'video',
};

export const DIAL = {
    CENTRE_CHANNEL_NAME: 'private-encrypted-dial-notification'
}
