const request = require('supertest');
const Category = require('../../src/models/Category');
const app = require('../../app');

describe('CategoryController', () => {
    it('should get all categories', async () => {
        const data = [
            { name: 'Category 1', isActive: true },
            { name: 'Category 2', isActive: true },
        ];
        jest.spyOn(Category, 'find').mockImplementation(() => data);

        const categories = await request(app).get('/categories');
        expect(categories.status).toBe(200);
        expect(categories.body.length).toBe(2);
    });

    it('should get a category', async () => {
        const data = { id: 1, isActive: false, name: 'Category 1' };
        jest.spyOn(Category, 'findById').mockImplementation(() => data);

        const category = await request(app).get('/categories/1');
        expect(category.status).toBe(200);
        expect(category.body).toHaveProperty('name', 'Category 1');
    });
});
