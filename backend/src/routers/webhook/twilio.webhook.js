import { Router } from 'express';
import logger from '../../utils/logger';
const router = Router();

const deSerializeData = (data) => (typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data);

router.post('/', async (request, response) => {
    const receivedEvent = deSerializeData(request.body);
    logger.info({ receivedEvent });
    switch (receivedEvent.StatusCallbackEvent) {
        case 'room-created':
            break;
        case 'room-ended':
            break;
        case 'composition-available':
            break;
    }
    return response.status(200).end();
});
export default router;
