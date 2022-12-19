export const makeRepository = function (model, methods) {
    return Object.freeze({
        model,
        async removeInstance(self) {
            return self.deleteOne();
        },
        async deleteMany(filter) {
            return this.model.deleteMany(filter);
        },
        async updateMany(filter, update) {
            return this.model.updateMany(filter, update);
        },
        async updateOne(filter, update) {
            return this.model.updateOne(filter, update);
        },
        async getCount(filter = {}) {
            return this.model.countDocuments(filter);
        },
        async create(data) {
            return this.model.create(data);
        },
        async all() {
            return this.model.find({});
        },
        async get(filter = {}) {
            return this.model.find(filter);
        },
        async retrieve(filter) {
            return this.model.findOne(filter);
        },
        ...methods,
    });
};
