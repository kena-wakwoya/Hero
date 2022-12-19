import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';

export default (actions) => (req, _res, next) => {
    const userActionsRequired = req.user?.actions_required || [];
    for (let action of actions) {
        if (userActionsRequired.indexOf(action) > -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'User operation denied', 403));
        }
    }
    return next();
};
