export class ApplicationResponseException extends Error {
    constructor(errorCode, message, statusCode) {
        super(message);
        this.name = 'ApplicationResponseException';
        if (statusCode) this.statusCode = statusCode;
        if (errorCode) this.errorCode = errorCode;
    }
}
