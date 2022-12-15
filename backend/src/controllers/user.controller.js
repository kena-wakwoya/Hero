import userBAO from '../bao/user';

export const getHeroesList = async (req, res, next) => {
    try {
        const {
            query: { page, limit, search },
        } = req?.validatedInput;
        const data = await userBAO.getHeroesList({ page, limit, search });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const getPlatforAdminList = async (req, res, next) => {
    try {
        const {
            query: { page, limit, search },
        } = req?.validatedInput;
        const data = await userBAO.getPlatformAdminList({ page, limit, search });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listCenterUserAdmin = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await userBAO.listCenterUserAdmin({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const administratorListCall = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await userBAO.listAdministratorCall({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const callOperatorStatistics = async (req, res, next) => {
    try {
        const {
            query: { page, limit },
        } = req?.validatedInput;
        const data = await userBAO.callOperatorStatistics({ page, limit });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const getCentreUsers = async (req, res, next) => {
    try {
        const {
            query: { page, limit, search, type, domain },
        } = req?.validatedInput;
        const data = await userBAO.getCentreUsers({ page, limit, search, type, domain, user: req.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const unFollowHero = async (req, res, next) => {
    try {
        const {
            body: { hero_id },
        } = req?.validatedInput;
        const data = await userBAO.unFollowHero({ hero_id: hero_id, user_id: req.user.id });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const generateDashboardStats = async (req, res, next) => {
    try {
        const {
            body: { call_date, alert_date, hero_date, trending_date },
        } = req?.validatedInput;
        const data = await userBAO.generateDashboardStats({ call_date, alert_date, hero_date, trending_date });
        res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const followHero = async (req, res, next) => {
    try {
        const {
            body: { hero_id },
        } = req?.validatedInput;
        const data = await userBAO.followHero({ hero_id: hero_id, user_id: req.user.id });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const removeFollower = async (req, res, next) => {
    try {
        const {
            body: { user_id },
        } = req?.validatedInput;
        const data = await userBAO.removeFollower({ hero_id: req.user.id, user_id: user_id });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const changeAccountStatus = async (req, res, next) => {
    try {
        const {
            body: { account_id, status },
        } = req?.validatedInput;
        const data = await userBAO.changeAccountStatus({ account_id, status, user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const changeAccountType = async (req, res, next) => {
    try {
        const {
            body: { account_id, account_type },
        } = req?.validatedInput;
        const data = await userBAO.changeAccountType({ account_id, account_type, user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
