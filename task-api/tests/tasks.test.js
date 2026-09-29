const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('Tasks API', () => {
  test('GET /tasks should return all tasks', async () => {
    taskService.create({ title: 'Task 1' });

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Task 1');
  });

  test('GET /tasks?status=done should filter by status', async () => {
    taskService.create({ title: 'Todo', status: 'todo' });
    taskService.create({ title: 'Done', status: 'done' });

    const response = await request(app)
      .get('/tasks')
      .query({ status: 'done' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe('done');
  });

  test('GET /tasks should support pagination', async () => {
    taskService.create({ title: 'Task 1' });
    taskService.create({ title: 'Task 2' });

    const response = await request(app)
      .get('/tasks')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /tasks/stats should return statistics', async () => {
    taskService.create({ title: 'Todo', status: 'todo' });
    taskService.create({ title: 'Done', status: 'done' });

    const response = await request(app).get('/tasks/stats');

    expect(response.status).toBe(200);
    expect(response.body.todo).toBe(1);
    expect(response.body.done).toBe(1);
  });

  test('POST /tasks should create a task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'New Task',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Task');
    expect(response.body.id).toBeDefined();
  });

  test('POST /tasks should reject invalid task data', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({});

    expect(response.status).toBe(400);
  });

  test('PUT /tasks/:id should update a task', async () => {
    const task = taskService.create({ title: 'Old Title' });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        title: 'Updated Title',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });

  test('PUT /tasks/:id should return 404 for missing task', async () => {
    const response = await request(app)
      .put('/tasks/invalid-id')
      .send({
        title: 'Updated',
      });

    expect(response.status).toBe(404);
  });

  test('DELETE /tasks/:id should delete a task', async () => {
    const task = taskService.create({ title: 'Delete Me' });

    const response = await request(app)
      .delete(`/tasks/${task.id}`);

    expect(response.status).toBe(204);
  });

  test('DELETE /tasks/:id should return 404 for missing task', async () => {
    const response = await request(app)
      .delete('/tasks/invalid-id');

    expect(response.status).toBe(404);
  });

  test('PATCH /tasks/:id/complete should complete a task', async () => {
    const task = taskService.create({ title: 'Complete Me' });

    const response = await request(app)
      .patch(`/tasks/${task.id}/complete`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('done');
    expect(response.body.completedAt).toBeDefined();
  });

    test('PATCH /tasks/:id/complete should return 404 for missing task', async () => {
    const response = await request(app)
      .patch('/tasks/invalid-id/complete');

    expect(response.status).toBe(404);
  });

  test('POST /tasks should reject an invalid status', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Invalid Status Task',
        status: 'invalid',
      });

    expect(response.status).toBe(400);
  });

  test('POST /tasks should reject an invalid priority', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Invalid Priority Task',
        priority: 'invalid',
      });

    expect(response.status).toBe(400);
  });

  test('PUT /tasks/:id should reject an empty title', async () => {
    const task = taskService.create({
      title: 'Original Title',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        title: '   ',
      });

    expect(response.status).toBe(400);
  });

  test('PATCH /tasks/:id/complete should return 404 for invalid id', async () => {
    const response = await request(app)
      .patch('/tasks/non-existent-id/complete');

    expect(response.status).toBe(404);
  });

  test('PATCH /tasks/:id/assign should assign a task', async () => {
    const task = taskService.create({
      title: 'Task to Assign',
    });

    const response = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: 'Adarsh',
      });

    expect(response.status).toBe(200);
    expect(response.body.assignee).toBe('Adarsh');
  });

  test('PATCH /tasks/:id/assign should return 404 for missing task', async () => {
    const response = await request(app)
      .patch('/tasks/non-existent-id/assign')
      .send({
        assignee: 'Adarsh',
      });

    expect(response.status).toBe(404);
  });

  test('PATCH /tasks/:id/assign should reject an empty assignee', async () => {
    const task = taskService.create({
      title: 'Task to Assign',
    });

    const response = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: '   ',
      });

    expect(response.status).toBe(400);
  });

   test('PATCH /tasks/:id/assign should reject an already assigned task', async () => {
    const task = taskService.create({
      title: 'Already Assigned Task',
    });

    await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: 'Adarsh',
      });

    const response = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: 'Rahul',
      });

    expect(response.status).toBe(400);
  });

});