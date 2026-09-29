const {
  validateCreateTask,
  validateUpdateTask,
} = require('../src/utils/validators');

describe('validateCreateTask', () => {
  test('should accept a valid task', () => {
    const result = validateCreateTask({
      title: 'Test Task',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-10-01T10:00:00.000Z',
    });

    expect(result).toBeNull();
  });

  test('should reject missing title', () => {
    expect(validateCreateTask({})).toBe(
      'title is required and must be a non-empty string'
    );
  });

  test('should reject empty title', () => {
    expect(validateCreateTask({ title: '   ' })).toBe(
      'title is required and must be a non-empty string'
    );
  });

  test('should reject non-string title', () => {
    expect(validateCreateTask({ title: 123 })).toBe(
      'title is required and must be a non-empty string'
    );
  });

  test('should reject invalid status', () => {
    expect(
      validateCreateTask({
        title: 'Test',
        status: 'invalid',
      })
    ).toContain('status must be one of');
  });

  test('should reject invalid priority', () => {
    expect(
      validateCreateTask({
        title: 'Test',
        priority: 'invalid',
      })
    ).toContain('priority must be one of');
  });

  test('should reject invalid dueDate', () => {
    expect(
      validateCreateTask({
        title: 'Test',
        dueDate: 'not-a-date',
      })
    ).toBe('dueDate must be a valid ISO date string');
  });
});

describe('validateUpdateTask', () => {
  test('should accept an empty update object', () => {
    expect(validateUpdateTask({})).toBeNull();
  });

  test('should accept valid update fields', () => {
    expect(
      validateUpdateTask({
        title: 'Updated Task',
        status: 'in_progress',
        priority: 'low',
        dueDate: '2026-10-01T10:00:00.000Z',
      })
    ).toBeNull();
  });

  test('should reject empty title', () => {
    expect(validateUpdateTask({ title: '   ' })).toBe(
      'title must be a non-empty string'
    );
  });

  test('should reject non-string title', () => {
    expect(validateUpdateTask({ title: 123 })).toBe(
      'title must be a non-empty string'
    );
  });

  test('should reject invalid status', () => {
    expect(
      validateUpdateTask({
        status: 'invalid',
      })
    ).toContain('status must be one of');
  });

  test('should reject invalid priority', () => {
    expect(
      validateUpdateTask({
        priority: 'invalid',
      })
    ).toContain('priority must be one of');
  });

  test('should reject invalid dueDate', () => {
    expect(
      validateUpdateTask({
        dueDate: 'wrong-date',
      })
    ).toBe('dueDate must be a valid ISO date string');
  });
});