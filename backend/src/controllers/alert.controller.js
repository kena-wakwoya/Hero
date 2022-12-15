import alertBAO from '../bao/alert';

export const listAlerts = async (req, res, next) => {
    try {
        const {
            query: { page, limit, search, mediaType, source },
        } = req?.validatedInput;
        const data = await alertBAO.listAlerts({
            page,
            limit,
            search,
            status: ['active', 'archive', 'deleted'],
            mediaType,
            source,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const listNewFeed = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await alertBAO.listNewFeed({
            page,
            limit,
            user_id: req.user.id,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const archiveAlert = async (req, res, next) => {
    try {
        const {
            body: { alertId },
        } = req?.validatedInput;
        const data = await alertBAO.updateAlert({ alertId, status: 'archive', user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const activateAlert = async (req, res, next) => {
    try {
        const {
            body: { alertId },
        } = req?.validatedInput;
        const data = await alertBAO.updateAlert({ alertId, status: 'active', user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const removeAlert = async (req, res, next) => {
    try {
        const {
            body: { alertId },
        } = req?.validatedInput;
        const data = await alertBAO.updateAlert({ alertId, status: 'deleted', user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listMyAlerts = async (req, res, next) => {
    try {
        const {
            query: { page, limit, search, mediaType, source },
        } = req?.validatedInput;
        const data = await alertBAO.listAlerts({
            page,
            limit,
            search,
            mediaType,
            source,
            status: ['active', 'archive'],
            user: req.user,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const likeAlert = async (req, res, next) => {
    try {
        const data = await alertBAO.likeAlert({ alertId: req.params.alertId, user: req.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const unlikeAlert = async (req, res, next) => {
    try {
        const data = await alertBAO.unlikeAlert({ alertId: req.params.alertId, user: req.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listComments = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await alertBAO.listComments({
            page,
            limit,
            alertId: req?.validatedInput?.params.alertId,
            user: req.user,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const data = await alertBAO.addComment({
            alertId: req?.validatedInput?.params.alertId,
            content: req?.validatedInput?.body?.content,
            user: req.user,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const removeComment = async (req, res, next) => {
    try {
        const data = await alertBAO.removeComment({
            alertId: req?.validatedInput?.params.alertId,
            commentId: req?.validatedInput?.params.commentId,
            user: req.user,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const addAlert = async (req, res, next) => {
    try {
        const {
            body: { tags, lat, long, address, mediaType, contentText, isViewerDiscretionAdvised },
            files: { media, mediaExt, mediaMineType },
        } = req?.validatedInput;
        const data = await alertBAO.addAlert({
            lat,
            long,
            address,
            tags,
            mediaType,
            contentText,
            media,
            mediaExt,
            mediaMineType,
            isViewerDiscretionAdvised,
            user: req?.user,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
