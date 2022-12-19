import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';

import validateEmail from '../utils/validateEmail';
import { CENTRE_TYPES } from '../config/constants';

export const validateDomain = (domain) => {
    const re = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return re.test(domain);
};

const validatePhone = (phone) => {
    const re = /^\d+$/i;
    return re.test(phone);
};

export const checkIfValidlatitude = (input) => {
    return isFinite(input) && Math.abs(input) <= 90;
};

export const checkIfValidLongitude = (input) => {
    return isFinite(input) && Math.abs(input) <= 180;
};

export function list(req, _, next) {
    let { page, limit, type, search } = req?.query;
    if (!page || !limit || !type) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'query.page, query.limit and query.type are required', 400),
        );
    }

    type = type?.toLowerCase();

    if (['dispatch', 'crisis'].indexOf(type) === -1) {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', "query.type must be one of ['dispatch', 'crisis']", 400),
        );
    }

    if (search) search = search.replace(/[^a-z0-9.]/gim, '');

    try {
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                type,
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

export function add(req, _, next) {
    const { type, email, domain, name, address, phone, long, lat, zip_code } = req.body;

    if (!type || !email || !domain || !name || !address || !phone || !long || !lat || !zip_code) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.type, body.email, body.domain, body.name, body.phone, body.long, body.lat, body.zip_code and body.address are required',
                400,
            ),
        );
    }

    if (!validatePhone(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone is not a valid phone', 422));
    }

    if (!validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    if (!validateDomain(domain)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.domian is not a valid domain', 422));
    }

    if (Object.values(CENTRE_TYPES).indexOf(type?.toLowerCase()) === -1) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.type is not a valid centre type', 422));
    }

    if (!checkIfValidLongitude(long)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.long is not a valid value', 422));
    }

    if (!checkIfValidlatitude(lat)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.lat is not a valid value', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            type: type?.toLowerCase(),
            email: email?.toLowerCase(),
            domain: domain?.toLowerCase(),
            name,
            address,
            phone,
            lat,
            long,
            zipCode: zip_code,
        },
    };
    return next();
}

export function view(req, _, next) {
    let { domain } = req.params;

    if (!domain) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'params.domain is required', 400));
    }

    domain = domain?.toLowerCase();

    if (!validateDomain(domain)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'params.domian is not a valid domain', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        params: {
            domain,
        },
    };
    return next();
}

export function update(req, _, next) {
    const { type, email, domain, name, address, phone, long, lat, is_active, zip_code } = req.body;

    if (!domain) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.domain is required', 400));
    }

    if (is_active && typeof is_active !== 'boolean') {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.is_active must be a boolean', 422));
    }

    if (phone && !validatePhone(phone)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.phone is not a valid phone', 422));
    }

    if (email && !validateEmail(email)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.email is not a valid email', 422));
    }

    if (!validateDomain(domain)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.domian is not a valid domain', 422));
    }

    if (type && Object.values(CENTRE_TYPES).indexOf(type?.toLowerCase()) === -1) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.type is not a valid centre type', 422));
    }

    if (long && !checkIfValidLongitude(long)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.long is not a valid value', 422));
    }

    if (lat && !checkIfValidlatitude(lat)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.lat is not a valid value', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            type: type?.toLowerCase(),
            email: email?.toLowerCase(),
            domain: domain?.toLowerCase(),
            name,
            address,
            phone,
            long,
            lat,
            isActive: is_active,
            zipCode: zip_code,
        },
    };
    return next();
}

export function remove(req, _, next) {
    const { domain } = req.body;

    if (!domain) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.domain is required', 400));
    }

    if (!validateDomain(domain)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.domian is not a valid domain', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            domain: domain?.toLowerCase(),
        },
    };
    return next();
}
