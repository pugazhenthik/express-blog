process.env.SECRET_KEY = 'mysecretkey';
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const authenticate = require('../../src/middlewares/authMiddleware');

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('Authentication Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();

        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', async () => {
        req.header.mockReturnValue(null);

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token not provided. Authorization denied',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if token is invalid', async () => {
        req.header.mockReturnValue('Bearer invalidToken');
        jwt.verify.mockImplementation(() => {
            throw new Error('jwt malformed');
        });

        await authenticate(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'invalidToken',
            process.env.SECRET_KEY,
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Authentication failed',
            error: 'jwt malformed',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if user not found', async () => {
        req.header.mockReturnValue('Bearer validToken');
        jwt.verify.mockReturnValue({ _id: 'mockUserId' });
        User.findById.mockResolvedValue(null);

        await authenticate(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'validToken',
            process.env.SECRET_KEY,
        );
        expect(User.findById).toHaveBeenCalledWith('mockUserId');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid token. User not found',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if authentication is successful', async () => {
        req.header.mockReturnValue('Bearer validToken');
        jwt.verify.mockReturnValue({ _id: 'mockUserId' });
        User.findById.mockResolvedValue({
            _id: 'mockUserId',
            name: 'Test User',
        });

        await authenticate(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'validToken',
            process.env.SECRET_KEY,
        );
        expect(User.findById).toHaveBeenCalledWith('mockUserId');
        expect(req.user).toEqual({ _id: 'mockUserId', name: 'Test User' });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
