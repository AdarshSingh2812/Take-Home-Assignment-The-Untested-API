# Take-Home Assignment — Submission Notes

## What I Completed

- Added unit tests for the task service.
- Added integration tests for the API routes using Supertest.
- Added validation and edge-case tests.
- Identified and fixed a pagination bug.
- Implemented `PATCH /tasks/:id/assign`.
- Added assignee validation and handling for missing/already-assigned tasks.
- Documented the bug and implementation decisions.

## Bug Found and Fixed

### Pagination Off-by-One Error

The bug was found in:

`src/services/taskService.js`

The original pagination logic used:

```js
const offset = page * limit;
```

For page 1 and limit 2, this caused pagination to start from the wrong array index.

It was fixed to:

```js
const offset = (page - 1) * limit;
```

This makes page 1 start from index 0 as expected.

The complete details are documented in `BUG_REPORT.md`.

## Task Assignment Feature

Implemented:

```http
PATCH /tasks/:id/assign
```

Example request:

```json
{
  "assignee": "Adarsh"
}
```

### Design Decisions

- Added an `assignee` field to tasks.
- Required the assignee to be a non-empty string.
- Return `404` when the task does not exist.
- Return `400` when the task is already assigned.
- Trim whitespace before storing the assignee.
- Added tests for successful assignment and edge cases.

## Testing

Final test result:

```text
Test Suites: 3 passed, 3 total
Tests:       49 passed, 49 total
```

## Code Coverage

```text
Statements: 96.83%
Branches:   92.04%
Functions:  93.33%
Lines:      96.52%
```

## What I Would Test Next

- More validation cases for task creation and updates.
- Invalid pagination values such as negative page numbers or limits.
- Boundary cases for due dates and overdue tasks.
- Concurrent requests to ensure task updates remain consistent.
- Malformed JSON and unexpected request data.

## What Surprised Me

The pagination logic initially had an off-by-one error. Page 1 was starting from the wrong array index because the offset was calculated using `page * limit` instead of `(page - 1) * limit`.

Writing the tests helped identify the issue before making the fix.

## Questions Before Production

- Would the in-memory task store be replaced with a persistent database?
- What authentication and authorization requirements should be added?
- What API rate limiting and security requirements are expected?
- What logging and monitoring should be used in production?
- What validation and error response format should the API follow?
- Should task assignment support reassignment in the future?
