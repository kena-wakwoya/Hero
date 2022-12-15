import dotenv from 'dotenv';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
import app from './app';
import logger from './utils/logger';

dotenv.config({ path: path.join(__dirname, '../.env') });

const { PORT, NODE_ENV } = process.env;

export default (async () => {
    process.on('uncaughtException', (error) => {
        logger.error({ uncaughtException: error });
    });

    process.on('unhandledRejection', function (error) {
        logger.error({ unhandledRejection: error });
    });

    const cpus = os.cpus().length;

    if (cluster.isMaster && NODE_ENV === 'production') {
        for (let i = 0; i < cpus; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker) => {
            console.warn(`[${worker.process.pid}]`, {
                message: 'Process terminated. Restarting.',
            });
            cluster.fork();
        });
    } else {
        app(PORT);
    }
})();
