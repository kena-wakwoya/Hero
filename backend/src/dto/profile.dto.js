import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import moment from 'moment';
import { FILE_TYPES, USERS_TYPE } from '../config/constants';

import validateEmail from '../utils/validateEmail';

export function view(req, _, next) {
    let { accountId } = req.params;

    if (!accountId) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'params.accountId is required', 400));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        params: {
            accountId,
        },
    };
    return next();
}

export function updateProfile(req, _, next) {
    let { dob, email, full_name, account_id, position, phone } = req.body;

    let avatar = req?.files?.avatar || null;

    let avatarData;

    if (avatar) {
        const { mimetype, data } = avatar;
        avatarData = data;
        if (mimetype.indexOf(FILE_TYPES.IMAGE) < 0) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'files.avatar must be an image', 400));
        }
    }

    const user = req?.user;

    if (
        user?.email &&
        email &&
        [USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(user.account_type) === -1
    )
        return next(new ApplicationResponseException('PERMISSION_DENIED', 'Email can not be updated', 403));

    if (
        account_id &&
        [USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER, USERS_TYPE.CENTRE_ADMIN].indexOf(
            user.account_type,
        ) === -1
    )
        return next(new ApplicationResponseException('PERMISSION_DENIED', 'account_id is not supported', 403));

    if (email && !validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    if (dob && !moment(dob, 'DD/MM/YYYY').isValid()) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.dob is not a valid date string of DD/MM/YYYY', 422),
        );
    }

    const re = /^\d+$/i;

    if (phone && !re.test(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone must be numeric', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            email,
            dob: dob ? moment(dob, 'DD/MM/YYYY').add(1, 'hours').toDate() : null,
            fullName: full_name?.trim(),
            account_id,
            position,
            phone
        },
        files: {
            avatar: avatarData,
        },
    };
    return next();
}
