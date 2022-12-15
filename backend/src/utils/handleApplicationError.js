import logger from './logger';
import { API_RESPONSE_STATUS } from '../config/constants';
import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export default function (error, responseWriter) {
    if (error instanceof TokenExpiredError) {
        return responseWriter.status(401).json({
            status: API_RESPONSE_STATUS.ERROR,
            message: 'Token expired',
            error_code: 'UNAUTHENTICATED',
        });
    }
    if (error instanceof JsonWebTokenError) {
        return responseWriter.status(401).json({
            status: API_RESPONSE_STATUS.ERROR,
            message: 'Invalid token',
            error_code: 'UNAUTHENTICATED',
        });
    }

    if (error instanceof ApplicationResponseException) {
        return responseWriter.status(error?.statusCode ?? 500).json({
            message: error?.message ?? '',
            status: API_RESPONSE_STATUS.ERROR,
            error_code: error?.errorCode ?? null,
        });
    }

    if (error?.statusCode && error?.statusCode < 500) {
        return responseWriter.status(error?.statusCode).json({
            message: error?.message ?? '',
            status: API_RESPONSE_STATUS.ERROR,
            error_code: 'VALIDATION_ERROR',
        });
    }
    
    logger.error(error);
    return responseWriter
        .status(500)
        .json({ status: API_RESPONSE_STATUS.ERROR, message: 'Internal Server Error', error_code: 'INTERNAL_SERVER_ERROR' });
}
