const request = require('supertest');
const Tag = require('../../src/models/Tag');
const app = require('../../app');

describe('TagController', () => {
    it('should get all tags', async () => {
        const data = [
            { name: 'Tag 1', isActive: true },
            { name: 'Tag 2', isActive: true },
        ];
        jest.spyOn(Tag, 'find').mockImplementation(() => data);
        const tags = await request(app).get('/tags');
        expect(tags.status).toBe(200);
        expect(tags.body.data.length).toBe(2);
    });

    it('should handle error in get all tags', async () => {
        jest.spyOn(Tag, 'find').mockImplementation(() => null);
        const tags = await request(app).get('/tags');
        expect(tags.status).toBe(200);
        expect(tags.body.message).toBe('No records found');
        expect(tags.body.data).toEqual([]);
    });

    it('should handle error in get all tags', async () => {
        jest.spyOn(Tag, 'find').mockImplementation(() => {
            throw new Error('Database error!');
        });
        const tags = await request(app).get('/tags');
        expect(tags.status).toBe(500);
        expect(tags.body.message).toBe(
            'Something went wrong while fetching tags.',
        );
        expect(tags.body.error).toBe('Database error!');
    });

    it('should get a tag', async () => {
        const data = { id: 1, isActive: false, name: 'Tag 1' };
        jest.spyOn(Tag, 'findById').mockImplementation(() => data);

        const tag = await request(app).get('/tags/1');
        expect(tag.status).toBe(200);
        expect(tag.body.data).toHaveProperty('name', 'Tag 1');
    });

    it('should handle tag not found 404 error', async () => {
        jest.spyOn(Tag, 'findById').mockResolvedValue(null);

        const tag = await request(app).get('/tags/1');

        expect(tag.status).toBe(404);
        expect(tag.body.message).toBe('Tag not found.');
    });

    it('should handle error in fetching tag', async () => {
        jest.spyOn(Tag, 'findById').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const tag = await request(app).get('/tags/1');

        expect(tag.status).toBe(500);
        expect(tag.body.message).toBe(
            'Something went wrong while fetching a tag.',
        );
        expect(tag.body.error).toBe('Database error!');
    });

    it('should handle error in create tag', async () => {
        jest.spyOn(Tag, 'create').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const response = await request(app)
            .post('/tags')
            .send({ name: 'Node js' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
            'Something went wrong while creating a tag.',
        );
    });

    it('should handle validtion error in create a tag', async () => {
        jest.spyOn(Tag, 'create').mockImplementation(() => {
            throw new Error('Validation error');
        });

        const response = await request(app).post('/tags').send({});
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Tag name is required.');
        expect(response.body.message).toBe(
            'Something went wrong while creating a tag.',
        );
    });

    it('should handle validtion error in create a tag', async () => {
        const data = {
            name: 'Node JS',
            isActive: true,
        };
        jest.spyOn(Tag, 'create').mockImplementation(() => data);

        const response = await request(app).post('/tags').send(data);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Tag created successfully.');
    });

    it('should handle error in update a tag', async () => {
        jest.spyOn(Tag, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const tag = await request(app).put('/tags/1').send({});

        expect(tag.status).toBe(500);
        expect(tag.body.message).toBe(
            'Something went wrong while updating a tag.',
        );
        expect(tag.body.error).toBe('Database error!');
    });

    it('should handle error 404 not found tag in update tag', async () => {
        jest.spyOn(Tag, 'findByIdAndUpdate').mockReturnValue(null);

        const tag = await request(app).put('/tags/1').send({});
        expect(tag.status).toBe(404);
        expect(tag.body.message).toBe('Tag not found.');
    });

    it('shold update a tag given input', async () => {
        const data = { id: 1, name: 'Updated tag', isAction: true };
        jest.spyOn(Tag, 'findByIdAndUpdate').mockImplementation(() => data);

        const tag = await request(app).put('/tags/1').send(data);
        expect(tag.status).toBe(200);
        expect(tag.body.message).toBe('Tag updated successfully.');
    });

    it('should handle tag not found error in delete tag', async () => {
        jest.spyOn(Tag, 'findByIdAndDelete').mockImplementation(() => null);

        const tag = await request(app).delete('/tags/1');

        expect(tag.status).toBe(404);
        expect(tag.body.message).toBe('Tag not found.');
    });

    it('should handle error in delete tag', async () => {
        jest.spyOn(Tag, 'findByIdAndDelete').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const tag = await request(app).delete('/tags/1');

        expect(tag.status).toBe(500);
        expect(tag.body.message).toBe(
            'Something went wrong while deleting a tag.',
        );
        expect(tag.body.error).toBe('Database error!');
    });

    it('should delete a tag', async () => {
        jest.spyOn(Tag, 'findByIdAndDelete').mockImplementation(() => true);

        const tag = await request(app).delete('/tags/1');

        expect(tag.status).toBe(200);
        expect(tag.body.message).toBe('Tag deleted successfully.');
    });
});
