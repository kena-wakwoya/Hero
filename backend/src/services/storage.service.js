import dotenv from 'dotenv';
import path from 'path';
import useLocalStorage from '../utils/useLocalStorage';
import useS3Storage from '../utils/useS3Storage';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default class {
    uploadProfileAvatar = (data, filename) => {
        const upload = process.env.NODE_ENV === 'development' ? useLocalStorage : useS3Storage;
        return upload(data, filename, 'image/png');
    };

    uploadAlertMedia = (data, filename) => {
        const upload = process.env.NODE_ENV === 'development' ? useLocalStorage : useS3Storage;
        return upload(data, filename, 'image/png');
    };
}
