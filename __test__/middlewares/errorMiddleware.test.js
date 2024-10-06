const {
    notFoundHandler,
    errorHandler,
} = require('../../src/middlewares/errorMiddleware');
const req = { originalUrl: '/api/invalid-route' };
const res = { status: jest.fn(), json: jest.fn() };
const next = jest.fn();
const err = new Error('Test error');

describe('Error Handlers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Not Found Handler', () => {
        it('should set status code to 404', async () => {
            notFoundHandler(req, res, next);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should call next with error', async () => {
            notFoundHandler(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next.mock.calls[0][0].message).toBe(
                `Not Found - ${req.originalUrl}`,
            );
        });
    });

    describe('Error Handler', () => {
        it('should set status code to 500 if no status code is set', async () => {
            res.statusCode = 200;
            errorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should keep existing status code', async () => {
            res.statusCode = 404;
            errorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return error message and stack in development environment', async () => {
            process.env.NODE_ENV = 'development';
            errorHandler(err, req, res, next);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json.mock.calls[0][0]).toEqual({
                message: err.message,
                stack: err.stack,
            });
        });

        it('should return error message without stack in production environment', async () => {
            process.env.NODE_ENV = 'production';
            errorHandler(err, req, res, next);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json.mock.calls[0][0]).toEqual({
                message: err.message,
                stack: null,
            });
        });
    });
});
