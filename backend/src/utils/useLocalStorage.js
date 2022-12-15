import dotenv from 'dotenv';
import path from 'path';
import mkdirp from 'mkdirp';
import { Readable } from 'stream';
import { createWriteStream, unlink } from 'fs';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { PORT } = process.env;

const UPLOAD_DIR = './uploads';

mkdirp.sync(UPLOAD_DIR);

export default async (data, filename, _contentType) => {
    const stream = Readable.from(data.toString());
    stream.push(data);
    const filePath = `${UPLOAD_DIR}/${filename}`;

    return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(filePath);
        writeStream.on('finish', () => resolve({ path: `http://localhost:${PORT}${filePath.substring(1)}` })); //substring to remove {{.}}
        writeStream.on('error', (error) => {
            unlink(filePath, () => {
                reject(error);
            });
        });
        stream.on('error', (error) => writeStream.destroy(error));
        stream.pipe(writeStream);
    });
};
