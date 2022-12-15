import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';


export function setupAccount(req, _, next) {
    const re = /^[a-z0-9]+$/i;
    let { full_name, username, onboard_id } = req.body;

    if (!full_name || !username || !onboard_id) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.full_name, body.username and body.onboard_id are required',
                400,
            ),
        );
    }

    username = username?.toLowerCase()?.trim();
    if (!re.test(username)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.username must be alphanumeric', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            fullName: full_name,
            username,
            onboardId: onboard_id,
        },
    };
    return next();
}

export function verifyPhone(req, _, next) {
    const re = /^\d+$/i;
    let { phone, type, code } = req.body;

    if (!phone || !type) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone and body.type are required', 400));
    }

    if (['confirm', 'request'].indexOf(type?.toLowerCase()?.trim()) === -1) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', "body.type must be of ['request', 'confirm']", 422),
        );
    }

    if (type === 'confirm' && !code) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.code is required for confirmation ', 400));
    }

    if (type === 'confirm' && !(re.test(code) && code.length === 4)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.code must be a 4 digit number', 422));
    }

    if (!re.test(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone must be numeric', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            phone,
            type,
            code,
        },
    };
    return next();
}

export function checkUsername(req, _, next) {
    let { username } = req.body;
    if (!username) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.username is required', 400));
    }
    username = username?.toLowerCase()?.trim();
    const re = /^[a-z0-9]+$/i;
    if (!re.test(username)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.username must be alphanumeric', 422));
    }
    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            username,
        },
    };
    return next();
}
