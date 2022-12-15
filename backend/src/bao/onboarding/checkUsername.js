import userRepository from '../../database/repositories/user.repository';

export default async function (username) {
    const user = await userRepository.checkUsername(username);
    return {
        is_available: user ? false : true,
    };
}
