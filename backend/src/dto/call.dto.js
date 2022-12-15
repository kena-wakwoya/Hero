import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';

import lodash from 'lodash';
import { checkIfValidlatitude, checkIfValidLongitude } from './centre.dto';

export function call(req, res, next) {
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
export function dial(req, _, next) {
    let { location } = req.body;

    if (!location || !lodash.isObject(location)) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.location is required and must tbe of type Location',
                422,
            ),
        );
    }

    const { long, lat, address } = location;

    if (!long || !lat || !address) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.location.long, body.location.lat and body.location.address are required',
                422,
            ),
        );
    }

    if (!checkIfValidLongitude(long)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.location.long is not a valid value', 422));
    }

    if (!checkIfValidlatitude(lat)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.location.lat is not a valid value', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            location,
        },
    };
    return next();
}

export function accept(req, _, next) {
    let { dial_id } = req.body;

    if (!dial_id) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.dial_id is required', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            dial_id,
        },
    };
    return next();
}

export function track(req, _, next) {
    let { video_track, audio_track, dial_id } = req.body;

    if (typeof video_track !== 'boolean' || typeof audio_track !== 'boolean') {
        return next(
            new ApplicationResponseException('VALIDATION_ERROR', 'body.video_track and body.audio_track must be bool', 422),
        );
    }

    if (!dial_id) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.dial_id is required', 422));
    }

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            audio_track,
            video_track,
            dial_id,
        },
    };
    return next();
}
