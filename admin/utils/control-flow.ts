export function abort_if(condition: boolean, statusCode?: number, message?: string) {
    if (condition) {
        throw new HttpError((statusCode ?? 500), message || 'Aborted');
    }
}

export function abort_unless(condition: boolean, statusCode?: number, message?: string) {
    if (!condition) {
        throw new HttpError((statusCode ?? 500), message || 'Aborted');
    }
}

class HttpError extends Error {
    isUserFacingError = true;
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}
