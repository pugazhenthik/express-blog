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

    it('should handle error in get all categories', async () => {
        jest.spyOn(Category, 'find').mockImplementation(() => {
            throw new Error('Database error!');
        });
        const categories = await request(app).get('/categories');
        expect(categories.status).toBe(500);
        expect(categories.body.message).toBe(
            'Something went wrong while fetching categories.',
        );
        expect(categories.body.error).toBe('Database error!');
    });

    it('should get a category', async () => {
        const data = { id: 1, isActive: false, name: 'Category 1' };
        jest.spyOn(Category, 'findById').mockImplementation(() => data);

        const category = await request(app).get('/categories/1');
        expect(category.status).toBe(200);
        expect(category.body).toHaveProperty('name', 'Category 1');
    });

    it('should handle category not found 404 error', async () => {
        jest.spyOn(Category, 'findById').mockResolvedValue(null);

        const category = await request(app).get('/categories/1');

        expect(category.status).toBe(404);
        expect(category.body.message).toBe('Category not found!');
    });

    it('should handle error in fetch category', async () => {
        jest.spyOn(Category, 'findById').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const category = await request(app).get('/categories/1');

        expect(category.status).toBe(500);
        expect(category.body.message).toBe(
            'Something went wrong while fetching a category.',
        );
        expect(category.body.error).toBe('Database error!');
    });

    it('should create a category', async () => {
        const data = {
            name: 'Node JS',
            description: 'Express is Node js framework',
            isActive: true,
        };
        jest.spyOn(Category, 'create').mockImplementation(() => {
            return data;
        });

        const category = await request(app).post('/categories').send(data);

        expect(category.status).toBe(201);
        expect(category.body.message).toBe('Category created successfully!');
        expect(category.body.data).toEqual(data);
    });

    it('should handle error in create a category', async () => {
        jest.spyOn(Category, 'create').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const category = await request(app).post('/categories').send({});

        expect(category.status).toBe(500);
        expect(category.body.message).toBe(
            'Something went wrong while creating a category',
        );
        expect(category.body.error).toBe('Database error!');
    });

    it('should handle error in update a category', async () => {
        jest.spyOn(Category, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const category = await request(app).put('/categories/1').send({});

        expect(category.status).toBe(500);
        expect(category.body.message).toBe(
            'Something went wrong while updating a category.',
        );
        expect(category.body.error).toBe('Database error!');
    });

    it('should handle error 404 not found category in update category', async () => {
        jest.spyOn(Category, 'findByIdAndUpdate').mockReturnValue(null);

        const category = await request(app).put('/categories/1').send({});
        expect(category.status).toBe(404);
        expect(category.body.message).toBe('Category not found!');
    });

    it('shold update a category given input', async () => {
        const data = { id: 1, name: 'Updated category', isAction: true };
        jest.spyOn(Category, 'findByIdAndUpdate').mockImplementation(
            () => data,
        );

        const category = await request(app).put('/categories/1').send(data);
        expect(category.status).toBe(200);
        expect(category.body.message).toBe('Category updated successfully!');
    });

    it('should handle category not found error in delete category', async () => {
        jest.spyOn(Category, 'findByIdAndDelete').mockImplementation(
            () => null,
        );

        const category = await request(app).delete('/categories/1');

        expect(category.status).toBe(404);
        expect(category.body.message).toBe('Category not found!');
    });

    it('should handle error in delete category', async () => {
        jest.spyOn(Category, 'findByIdAndDelete').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const category = await request(app).delete('/categories/1');

        expect(category.status).toBe(500);
        expect(category.body.message).toBe(
            'Something went wrong while deleting a category.',
        );
        expect(category.body.error).toBe('Database error!');
    });
});
