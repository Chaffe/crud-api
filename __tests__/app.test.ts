import request from 'supertest';
import http from 'http';
import app from '../src/app';
import { UserDto } from "../src/types/user.dto";
import {BASE_API_URL, STATUS_MODELS} from "../src/consts";

const server = http.createServer(app);

describe('CRUD API Tests', () => {
  let createdUser: UserDto;

  beforeAll((done) => {
    server.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  it('Scenario 1: Full CRUD cycle', async () => {
    // 1. GET api/users
    const getAllResponse = await request(server).get(BASE_API_URL);
    expect(getAllResponse.status).toBe(STATUS_MODELS.SUCCEEDED_REQUEST.code);
    expect(getAllResponse.body).toEqual([]);

    // 2. POST api/users
    const newUser = { username: 'John Doe', age: 30, hobbies: ['reading', 'coding'] };
    const createResponse = await request(server).post(BASE_API_URL).send(newUser);
    expect(createResponse.status).toBe(STATUS_MODELS.CREATED_REQUEST.code);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.username).toBe(newUser.username);
    expect(createResponse.body.age).toBe(newUser.age);
    expect(createResponse.body.hobbies).toEqual(newUser.hobbies);
    createdUser = createResponse.body;

    // 3. GET api/users/{userId}
    const getUserResponse = await request(server).get(`${BASE_API_URL}/${createdUser.id}`);
    expect(getUserResponse.status).toBe(STATUS_MODELS.SUCCEEDED_REQUEST.code);
    expect(getUserResponse.body).toEqual(createdUser);

    // 4. PUT api/users/{userId}
    const updatedUser = { username: 'Jane Doe', age: 25, hobbies: ['swimming'] };
    const updateResponse = await request(server).put(`${BASE_API_URL}/${createdUser.id}`).send(updatedUser);
    expect(updateResponse.status).toBe(STATUS_MODELS.SUCCEEDED_REQUEST.code);
    expect(updateResponse.body.id).toBe(createdUser.id);
    expect(updateResponse.body.username).toBe(updatedUser.username);
    expect(updateResponse.body.age).toBe(updatedUser.age);
    expect(updateResponse.body.hobbies).toEqual(updatedUser.hobbies);

    // 5. DELETE api/users/{userId}
    const deleteResponse = await request(server).delete(`${BASE_API_URL}/${createdUser.id}`);
    expect(deleteResponse.status).toBe(STATUS_MODELS.DELETED_REQUEST.code);

    // 6. GET api/users/{userId}
    const getDeletedResponse = await request(server).get(`${BASE_API_URL}/${createdUser.id}`);
    expect(getDeletedResponse.status).toBe(STATUS_MODELS.NOT_FOUND.code);
  });

  it('Scenario 2: Invalid userId in GET', async () => {
    const response = await request(server).get(`${BASE_API_URL}/invalid-uuid`);
    expect(response.status).toBe(STATUS_MODELS.BAD_REQUEST.code);
  });

  it('Scenario 3: POST with missing required fields', async () => {
    const invalidUser = { username: 'Test' };
    const response = await request(server).post(BASE_API_URL).send(invalidUser);
    expect(response.status).toBe(STATUS_MODELS.BAD_REQUEST.code);
  });

  it('Scenario 4: Non-existing endpoint', async () => {
    const response = await request(server).get('/some-non/existing/resource');
    expect(response.status).toBe(STATUS_MODELS.NOT_FOUND.code);
  });
});