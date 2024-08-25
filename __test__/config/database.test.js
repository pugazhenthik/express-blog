const mongoose = require('mongoose');

const { connectDB } = require('../../src/config/database');

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {
        db: {
            admin: jest.fn().mockReturnThis(),
            command: jest.fn(),
        },
    },
}));

describe('Database', () => {
    it('should connect the database and log success message', async () => {
        mongoose.connect.mockResolvedValue(mongoose.connection);
        mongoose.connection.db.admin().command.mockImplementation(() => {});
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        await connectDB();

        expect(mongoose.connect).toHaveBeenCalled();
        expect(mongoose.connection.db.admin().command).toHaveBeenCalledWith({
            ping: 1,
        });
        expect(consoleSpy).toHaveBeenCalledWith('MongoDB Connected');
    });

    it('should handle the database connection failed', async () => {
        mongoose.connect.mockImplementation(() => null);

        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        await connectDB();

        expect(consoleSpy).toHaveBeenCalledWith('MongoDB connection failed');
    });

    it('should handle the database connection error', async () => {
        mongoose.connect.mockImplementation(() => {
            throw new Error('Connection error');
        });

        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        await connectDB();

        expect(consoleSpy).toHaveBeenCalledWith('MongoDB Not Connected');
    });
});
