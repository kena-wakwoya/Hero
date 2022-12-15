import { USERS_TYPE } from '../config/constants';
import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import { validateDomain } from './centre.dto';

export function changeAccountType(req, _, next) {
    let { account_id, account_type } = req?.body;
    if (!account_id || !account_type) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.account_id and body.account_type are required', 400),
        );
    }

    account_type = String(account_type).toLowerCase();
    if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(account_type) === -1) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.account_type must be one of: centre_admin or centre_operator',
                400,
            ),
        );
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            account_id,
            account_type,
        },
    };
    return next();
}
export function removeFollower(req, res, next) {
    let { user_id } = req.body;

    if (!user_id) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'User id is required', 400));
    }
    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            user_id: user_id,
        },
    };
    return next();
}
export function unFollowHero(req, _, next) {
    let { hero_id } = req.body;
    if (!hero_id) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'Hero id is required', 400));
    }
    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            hero_id: hero_id,
        },
    };
    return next();
}

export function followHero(req, _, next) {
    let { hero_id } = req?.body;
    if (!hero_id) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'Hero id is required', 400));
    }
    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            hero_id: hero_id,
        },
    };
    return next();
}

export function listCenterUserAdmin(req, res, next) {
    let { page, limit } = req?.query;
    if (!page || !limit) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.page and query.limit are required', 400));
    }

    try {
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                limit: Number(limit),
                page: Number(page),
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}
export function changeAccountStatus(req, _, next) {
    let { account_id, status } = req?.body;
    if (!account_id || !status) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.account_id and body.status are required', 400),
        );
    }

    status = String(status).toLowerCase();
    if (['deactivate', 'activate'].indexOf(status) === -1) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.status must be one of: deactivate, activate', 400),
        );
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            account_id,
            status: status === 'activate' ? 'active' : 'deleted',
        },
    };
    return next();
}

export function getCentreUsers(req, _, next) {
    let { page, limit, search, type, domain } = req?.query;
    // if account_type === centre_admin
    // check account_domain === domain
    if (!page || !limit) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.page and query.limit are required', 400));
    }

    domain = domain?.toLowerCase();

    if (!domain && !type) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'query.page, query.type and query.limit are required', 400),
        );
    }

    if (domain && !validateDomain(domain)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.domian is not a valid domain', 422));
    }

    type = type?.toLowerCase();

    if (type && ['dispatch', 'crisis'].indexOf(type) === -1) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', "query.type must be one of ['dispatch', 'crisis']", 400),
        );
    }

    if (search) search = search.replace(/[^a-z0-9.]/gim, '');

    try {
        doPageLimitValidate(page, limit);
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                limit: Number(limit),
                page: Number(page),
                search,
                type,
                domain,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

export const doPageLimitValidate = (page, limit) => {
    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.page must be a positive number', 400);
    }
    if (limit < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be a positive number', 400);
    }
    if (limit > 99) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be less than 100', 400);
    }
};

export function getHeroesList(req, _, next) {
    let { page, limit, search } = req?.query;
    if (!page || !limit) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.page, and query.limit are required', 400));
    }

    if (search) search = search.replace(/[^a-z0-9.]/gim, '');

    try {
        doPageLimitValidate(page, limit);
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                limit: Number(limit),
                page: Number(page),
                search,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}
