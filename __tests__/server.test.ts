import supertest from 'supertest';
import app from "../src/app";

const request = supertest(app);

describe('Simple CRUD API Server Tests', () => {
  let id: string;

  test('should respond status code 200 for GET /api/users', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
  });

  test('should get empty array for GET api/users', async () => {
    const response = await request.get('/api/users');
    expect(JSON.parse(response.text)).toEqual([]);
  });

  test('should respond status code 404 for non-existing resource', async () => {
    const response = await request.get('/some-non/existing/resource');
    expect(response.status).toBe(404);
  });

  test('should respond status code 201 with a POST /api/users', async () => {
    const userData = {
      username: 'Mike',
      age: 31,
      hobbies: ['Coding', 'Art'],
    };

    const response = await request.post('/api/users').send(userData);
    expect(response.status).toBe(201);
  });

  test('should respond new user object with a POST /api/users', async () => {
    const userData = {
      username: 'Mike',
      age: 31,
      hobbies: ['Coding', 'Art'],
    };

    const response = await request.post('/api/users').send(userData);
    const json = JSON.parse(response.text);
    expect(json).toBeDefined();
    expect(json.id).not.toBeNull();
    id = json.id;
  });

  test('should respond user object with a GET /api/users/:id', async () => {
    const response = await request.get(`/api/users/${id}`);
    const json = JSON.parse(response.text);
    expect(json.id).toBe(id);
  });

  test('should respond update user object with a PUT /api/users/:id', async () => {
    const userData = {
      username: 'Tony',
      age: 55,
      hobbies: ['Football', 'Travelling', 'Hiking'],
    };

    const response = await request.put(`/api/users/${id}`).send(userData);
    const json = JSON.parse(response.text);
    expect(json).toBeDefined();
    expect(json.username).toBe(userData.username);
  });

  test('should respond status code 204 with a DELETE /api/users/:id', async () => {
    const response = await request.delete(`/api/users/${id}`);
    expect(response.status).toBe(204);
  });
});
