const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('Task Service', () => {
  test('should create a task with default values', () => {
    const task = taskService.create({
      title: 'Test Task',
    });

    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
    expect(task.description).toBe('');
    expect(task.dueDate).toBeNull();
    expect(task.completedAt).toBeNull();
    expect(task.id).toBeDefined();
    expect(task.createdAt).toBeDefined();
  });

  test('should return all tasks', () => {
    taskService.create({ title: 'Task 1' });
    taskService.create({ title: 'Task 2' });

    const tasks = taskService.getAll();

    expect(tasks).toHaveLength(2);
  });

  test('should find a task by id', () => {
    const task = taskService.create({ title: 'Find Me' });

    const found = taskService.findById(task.id);

    expect(found).toEqual(task);
  });

  test('should return null when task id does not exist', () => {
    expect(taskService.findById('invalid-id')).toBeUndefined();
  });

  test('should filter tasks by status', () => {
    taskService.create({ title: 'Todo Task', status: 'todo' });
    taskService.create({ title: 'Done Task', status: 'done' });

    const result = taskService.getByStatus('done');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Done Task');
  });

  test('should paginate tasks', () => {
    const task1 = taskService.create({ title: 'Task 1' });
    const task2 = taskService.create({ title: 'Task 2' });
    taskService.create({ title: 'Task 3' });

    const result = taskService.getPaginated(1, 2);

    expect(result).toEqual([task1, task2]);
  });

  test('should update a task', () => {
    const task = taskService.create({ title: 'Old Title' });

    const updated = taskService.update(task.id, {
      title: 'New Title',
      priority: 'high',
    });

    expect(updated.title).toBe('New Title');
    expect(updated.priority).toBe('high');
  });

  test('should return null when updating a missing task', () => {
    const result = taskService.update('invalid-id', {
      title: 'New Title',
    });

    expect(result).toBeNull();
  });

  test('should remove a task', () => {
    const task = taskService.create({ title: 'Delete Me' });

    const result = taskService.remove(task.id);

    expect(result).toBe(true);
    expect(taskService.findById(task.id)).toBeUndefined();
  });

  test('should return false when removing a missing task', () => {
    expect(taskService.remove('invalid-id')).toBe(false);
  });

  test('should complete a task', () => {
    const task = taskService.create({
      title: 'Complete Me',
      priority: 'high',
    });

    const completed = taskService.completeTask(task.id);

    expect(completed.status).toBe('done');
    expect(completed.completedAt).toBeDefined();
  });

  test('should return null when completing a missing task', () => {
    expect(taskService.completeTask('invalid-id')).toBeNull();
  });

  test('should calculate task statistics', () => {
    taskService.create({ title: 'Todo', status: 'todo' });
    taskService.create({ title: 'Progress', status: 'in_progress' });
    taskService.create({ title: 'Done', status: 'done' });

    const stats = taskService.getStats();

    expect(stats.todo).toBe(1);
    expect(stats.in_progress).toBe(1);
    expect(stats.done).toBe(1);
    expect(stats.overdue).toBe(0);
  });

  test('should assign a task to an assignee', () => {
    const task = taskService.create({
      title: 'Assign Me',
    });

    const updated = taskService.assignTask(task.id, 'Adarsh');

    expect(updated.assignee).toBe('Adarsh');
  });

  test('should return null when assigning a missing task', () => {
    const result = taskService.assignTask('invalid-id', 'Adarsh');

    expect(result).toBeNull();
  });
});