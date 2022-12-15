import express from 'express';
import cors from 'cors';
import Fingerprint from 'express-fingerprint';
import logRequestDetails from 'express-log-url';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import handleApplicationError from './utils/handleApplicationError';
import logger from './utils/logger';
import initializeRoutes from './routers';
import authMiddleware from './middlewares/auth.middleware';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { initializeDatabaseConnection, seedDatabase, initModels } from './database';

(async () => {
    try {
        const instance = await initializeDatabaseConnection();
        await initModels(instance);
        await seedDatabase();
    } catch (error) {
        logger.error({ ApllicationStartUpError: error });
        process.exit(1);
    }
})();

export default (port) => {
    const app = express();

    if (process.env.NODE_ENV !== 'production') {
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    }

    app.use((req, res, next) => {
        if (req.url === '/api/healthcheck') {
            return next();
        }
        return logRequestDetails(req, res, next);
    });

    app.use(
        Fingerprint({
            parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
        }),
    );

    app.use(cors('*'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(
        fileUpload({
            createParentPath: true,
        }),
    );

    app.use(authMiddleware);

    // Initialize Routes
    initializeRoutes(app);

    app.use((error, _, responseWriter, __) => {
        handleApplicationError(error, responseWriter);
    });
    return app.listen(port, () => logger.info(`Server is listening on port ${port}`));
};
