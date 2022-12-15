import dotenv from 'dotenv';
import path from 'path';
import { uuid } from 'uuidv4';
import alertRepository from '../../database/repositories/alert.repository';
import StorageService from '../../services/storage.service';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const { CLOUDFRONT_URL } = process.env;

export default async function ({
    tags,
    lat,
    long,
    address,
    contentText,
    media,
    mediaType,
    mediaExt,
    mediaMineType,
    user,
    isViewerDiscretionAdvised,
}) {
    let mediaContent = '';

    let alertUUID = uuid();
    if (media) {
        const storageService = new StorageService();
        const { path: filePath } = await storageService.uploadAlertMedia(media, `${alertUUID}${mediaExt}`, mediaMineType);

        mediaContent = process.env.NODE_ENV === 'development' ? filePath : `${CLOUDFRONT_URL}/${alertUUID}${mediaExt}`;
    }

    await alertRepository.create({
        uuid: alertUUID,
        long,
        lat,
        address,
        content_text: contentText,
        media_type: mediaType,
        media_content: mediaContent,
        user_id: user.id,
        tags,
        is_viewer_discretion_advised: isViewerDiscretionAdvised,
    });

    return null;
}
