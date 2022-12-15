import validator from 'email-validator';

export default (email) => {
    return validator.validate(email);
};
