import centreBAO from '../bao/centre';

export const addCentre = async (req, res, next) => {
    try {
        const {
            body: { type, email, domain, name, address, phone, long, lat, zipCode },
        } = req?.validatedInput;
        const data = await centreBAO.addCentre({ type, email, domain, name, address, phone, long, lat, zipCode });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const viewCentre = async (req, res, next) => {
    try {
        const {
            params: { domain },
        } = req?.validatedInput;
        const data = await centreBAO.viewCentre({ domain, user: req?.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const updateCentre = async (req, res, next) => {
    try {
        const {
            body: { type, email, domain, name, address, phone, long, lat, isActive, zipCode },
        } = req?.validatedInput;
        const data = await centreBAO.updateCentre({
            type,
            email,
            domain,
            name,
            address,
            phone,
            long,
            lat,
            isActive,
            zipCode,
            user: req.user
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const removeCentre = async (req, res, next) => {
    try {
        const {
            body: { domain },
        } = req?.validatedInput;
        const data = await centreBAO.removeCentre({ domain });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const listCentres = async (req, res, next) => {
    try {
        const {
            query: { type, page, limit, search },
        } = req?.validatedInput;
        const data = await centreBAO.listCentres({ type, page, limit, search });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
