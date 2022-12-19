import path from 'path';
import dotenv from 'dotenv';
import _Pusher from 'pusher';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET, PUSHER_APP_CLUSTER, PUSHER_ENCRYPTION_KEY } = process.env;

class Singleton {
    constructor() {
        console.log('Pusher: ', {
            appId: PUSHER_APP_ID,
            key: PUSHER_APP_KEY,
            secret: PUSHER_APP_SECRET,
            cluster: PUSHER_APP_CLUSTER,
            encryptionMasterKeyBase64: PUSHER_ENCRYPTION_KEY,
        });
        this.pusher = new _Pusher({
            appId: PUSHER_APP_ID,
            key: PUSHER_APP_KEY,
            secret: PUSHER_APP_SECRET,
            cluster: PUSHER_APP_CLUSTER,
            encryptionMasterKeyBase64: PUSHER_ENCRYPTION_KEY,
        });
    }
}

const instance = new Singleton();

export const Pusher = instance.pusher;
