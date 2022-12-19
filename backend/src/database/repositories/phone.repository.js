import { getModels } from '../index';

export default {
    create: (data) => {
        const { Phone } = getModels();
        return Phone.create(data);
    },
    updateOrCreate: (filter, data, shouldUpdate = false) => {
        const { Phone } = getModels();
        if (shouldUpdate) return Phone.update(data, { where: filter });
        return Phone.create(data);
    },
    retrieve: (filter) => {
        const { Phone } = getModels();
        return Phone.findOne({ where: filter });
    },
};
