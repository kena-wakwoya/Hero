import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import { FILE_TYPES, MEDIA_TYPE } from '../config/constants';
import { checkIfValidlatitude, checkIfValidLongitude } from './centre.dto';

export function updateAlert(req, _, next) {
    try {
        let { alert_id } = req?.body;
        if (!alert_id) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.alert_id is required', 400));
        }

        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            body: {
                alertId: alert_id,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

export function removeComment(req, _, next) {
    try {
        const { alertId, commentId } = req.params;
        if (!alertId || !commentId) {
            return next(
                new ApplicationResponseException(
                    'VALIDATION_ERROR',
                    'params.alertId and params.commentId are required',
                    400,
                ),
            );
        }
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            params: {
                alertId,
                commentId,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

export function addComment(req, _, next) {
    try {
        const { alertId } = req.params;
        const { content } = req?.body;
        if (!alertId) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'params.alertId is required', 400));
        }

        if (!content) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.content is required', 400));
        }

        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            body: {
                content: content,
            },
            params: {
                alertId,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

export function listComments(req, _, next) {
    try {
        const { alertId } = req.params;
        if (!alertId) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'params.alertId is required', 400));
        }

        let { page, limit } = req?.query;
        if (!page || !limit) {
            return next(
                new ApplicationResponseException('VALIDATION_ERROR', 'query.page and query.limit are required', 400),
            );
        }

        if (page < 1) {
            throw new ApplicationResponseException('VALIDATION_ERROR', 'query.page must be a positive number', 400);
        }
        if (limit < 1) {
            throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be a positive number', 400);
        }
        if (limit > 99) {
            throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be less than 100', 400);
        }

        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                page: Number(page),
                limit: Number(limit),
            },
            params: {
                alertId,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}
export function listNewFeed(req, _, next) {
    let { page, limit } = req?.query;
    if (!page || !limit) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.page and query.limit are required', 400));
    }

    if (page < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.page must be a positive number', 400);
    }
    if (limit < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be a positive number', 400);
    }
    if (limit > 99) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be less than 100', 400);
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

export function list(req, _, next) {
    let { page, limit, search, media_type, source } = req?.query;
    if (!page || !limit) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.page and query.limit are required', 400));
    }

    if (!source) source = `poster`;
    source = source?.toLowerCase();

    if (page < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.page must be a positive number', 400);
    }
    if (limit < 1) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be a positive number', 400);
    }
    if (limit > 99) {
        throw new ApplicationResponseException('VALIDATION_ERROR', 'query.limit must be less than 100', 400);
    }

    if (media_type) {
        media_type = media_type?.toLowerCase();
        if (Object.values(MEDIA_TYPE).indexOf(media_type) === -1) {
            return next(
                new ApplicationResponseException('VALIDATION_ERROR', 'query.media_type is not a valid media type', 422),
            );
        }
    }

    if (['poster', 'liked'].indexOf(source) === -1) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'query.source is not a valid source', 422));
    }

    if (search) search = search.replace(/[^a-z0-9.]/gim, '');

    try {
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            query: {
                limit: Number(limit),
                page: Number(page),
                search,
                mediaType: media_type,
                source,
            },
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

export function addAlert(req, _, next) {
    let { lat, long, address, content_text, media_type, tags, is_viewer_discretion_advised } = req.body;

    if (!lat || !long || !address || !content_text || !media_type) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.lat, body.long, body.address, body.content_text, and body.media_type are required',
                400,
            ),
        );
    }

    if (tags) tags = tags?.trim()?.split(',') || [];

    if (!checkIfValidLongitude(long)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.long is not a valid value', 422));
    }

    if (!checkIfValidlatitude(lat)) {
        return next(new ApplicationResponseException('VALIDATION_ERROR', 'body.lat is not a valid value', 422));
    }

    if (Object.values(MEDIA_TYPE).indexOf(media_type?.toLowerCase()) === -1) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.media_type must be of type livestream or image or video or post',
                400,
            ),
        );
    }

    let media = req?.files?.media || null;

    let mediaData;
    let mediaExt;
    let mediaMineType;

    if ([MEDIA_TYPE.VIDEO, MEDIA_TYPE.IMAGE].indexOf(media_type?.toLowerCase()) > -1 && !media) {
        return next(
            new ApplicationResponseException(
                'VALIDATION_ERROR',
                'body.media is required for media_type: ' + media_type,
                400,
            ),
        );
    }

    if (media) {
        const { mimetype, data } = media;
        mediaData = data;
        if (media_type === MEDIA_TYPE.IMAGE && mimetype.indexOf(FILE_TYPES.IMAGE) < 0) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'files.media must be an image', 400));
        }
        if (media_type === MEDIA_TYPE.VIDEO && mimetype.indexOf(FILE_TYPES.VIDEO) < 0) {
            return next(new ApplicationResponseException('VALIDATION_ERROR', 'files.media must be a vide', 400));
        }
        mediaExt = media?.name.substring(media?.name?.lastIndexOf('.'), media?.name?.length);
        mediaMineType = media?.mimetype;
    }

    let isViewerDiscretionAdvised = 0;

    if (Number(is_viewer_discretion_advised) == 1) isViewerDiscretionAdvised = 1;

    req.validatedInput = {
        ...(req?.validatedInput ?? {}),
        body: {
            lat,
            long,
            address,
            mediaType: media_type,
            contentText: content_text,
            tags: JSON.stringify(tags),
            isViewerDiscretionAdvised,
        },
        files: {
            media: mediaData,
            mediaExt,
            mediaMineType,
        },
    };
    return next();
}
