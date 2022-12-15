import { getModels } from '../index';

export default {
    create: (data) => {
        const { PasswordReset } = getModels();
        return PasswordReset.create(data);
    },
    retrieve: (filter) => {
        const { PasswordReset } = getModels();
        return PasswordReset.findOne({ where: filter });
    },
    update: (filter, data) => {
        const { PasswordReset } = getModels();
        return PasswordReset.update(data, { where: filter });
    },
    remove: (filter) => {
        const { PasswordReset } = getModels();
        return PasswordReset.destroy({ where: filter });
    },
    findOneLeast: (filterArray) => {
        const { PasswordReset } = getModels();
        return PasswordReset.findOne({ $or: filterArray });
    },
};
