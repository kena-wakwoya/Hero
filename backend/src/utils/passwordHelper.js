import bcrypt from 'bcrypt';

export default {
    compare: (value, hash) => bcrypt.compare(value, hash),
    hash: (value) => bcrypt.hash(value, 10),
};
