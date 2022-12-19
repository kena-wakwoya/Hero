import profileBAO from '../bao/profile';

export const viewProfile = async (req, res, next) => {
    try {
        const {
            params: { accountId },
        } = req?.validatedInput;
        const user = req.user;
        const data = await profileBAO.viewProfile({ user, accountId });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const {
            body: { email, dob, fullName, account_id, position, phone },
            files: { avatar },
        } = req?.validatedInput;
        const user = req.user;
        const data = await profileBAO.updateProfile({ email, dob, avatar, user, fullName, account_id, position, phone });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (req, res) => {
    const user = req.user;

    const data = await profileBAO.me({ user });
    return res.json({
        status: 'success',
        data,
    });
};
