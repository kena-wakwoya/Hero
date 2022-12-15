import { USERS_TYPE } from '../config/constants';
import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import validateEmail from '../utils/validateEmail';

export function loginWithPhone(req, _, next) {
    const re = /^\d+$/i;
    let { phone } = req.body;

    if (!phone) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone is required', 400));
    }

    if (!re.test(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone must be numeric', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            phone,
        },
    };
    return next();
}

export function loginWithEmail(req, _, next) {
    let { password, email } = req.body;

    if (!password || !email) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.password and body.email are required', 400));
    }

    if (!validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    if (password.length < 8) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'login details is not valid', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            email,
            password,
        },
    };
    return next();
}

export function changePassword(req, _, next) {
    let { old_password, new_password } = req.body;

    if (old_password.length < 8) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'Incorrect old password', 422));
    }

    if (new_password.length < 8) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'New password must be at least 8 characters', 422));
    }

    if (new_password === old_password) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'New password can not be your old password', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            newPassword: new_password,
            oldPassword: old_password,
        },
    };
    return next();
}

export function resetPassword(req, _, next) {
    let { code, new_password } = req.body;

    if (!code || !new_password) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.code and body.new_password are required', 422),
        );
    }

    if (new_password.length < 8) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'New password must be at least 8 characters', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            code,
            newPassword: new_password,
        },
    };
    return next();
}

export function requestPassword(req, _, next) {
    let { email } = req.body;

    if (!validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            email,
        },
    };
    return next();
}

export function inviteUser(req, _, next) {
    let { email, account_type, full_name, centre_domain, position, phone } = req.body;

    const re = /^\d+$/i;

    account_type = account_type?.toLowerCase();

    phone = String(phone);

    if (phone && !re.test(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone must be numeric', 422));
    }

    const allowedAccountTypes = Object.values(USERS_TYPE)?.filter((type) => {
        return [USERS_TYPE.PLATFORM_OWNER, USERS_TYPE.HERO].indexOf(type) === -1 ? true : false;
    });

    if (!validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    if (allowedAccountTypes.indexOf(account_type?.toLowerCase()) === -1) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'Invalid account type', 422));
    }

    if (req.user?.account_type === USERS_TYPE.CENTRE_ADMIN) {
        centre_domain = req?.user?.user_centre?.domain;
    }

    if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(account_type) > -1 && !centre_domain) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.centre_domain is required', 422));
    }

    if (
        [USERS_TYPE.PLATFORM_ADMINISTRATOR].indexOf(account_type) > -1 &&
        [USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(req.user?.account_type || '') > -1
    ) {
        return next(new ApplicationResponseException('PERMISSION_DENIED', 'Permission denied', 403));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            email,
            fullName: full_name,
            accountType: account_type,
            position,
            centreDomain: centre_domain,
            phone,
        },
    };
    return next();
}
