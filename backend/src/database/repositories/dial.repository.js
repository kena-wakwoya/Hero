import { getModels } from '../index';

export default {
    create: (data) => {
        data.originalUsers = data.originalUsers ? JSON.stringify(data.originalUsers) : '[]';
        data.includedUsers = data.includedUsers ? JSON.stringify(data.includedUsers) : '[]';
        data.call_details = data.call_details ? JSON.stringify(data.call_details) : '{}';
        const { Dial } = getModels();
        return Dial.create(data);
    },
    retrieve: async (filter) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { Dial } = getModels();
                const data = await Dial.findOne({ where: filter });
                data.originalUsers = JSON.parse(data.originalUsers);
                data.includedUsers = JSON.parse(data.includedUsers);
                data.call_details = JSON.parse(data.call_details);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    },
    update: (filter, data) => {
        const { Dial } = getModels();
        data.originalUsers = JSON.stringify(data.originalUsers);
        data.includedUsers = JSON.stringify(data.includedUsers);
        data.call_details = JSON.stringify(data.call_details);
        return Dial.update(data, { where: filter });
    },
};
