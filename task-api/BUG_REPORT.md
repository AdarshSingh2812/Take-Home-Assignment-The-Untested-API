# Bug Report

## Bug: Pagination returns incorrect results

### Expected Behavior

When requesting the first page with a given limit, the API should return tasks starting from the first task.

For example:

GET /tasks?page=1&limit=2

should return the first 2 tasks.

### Actual Behavior

The API returns incorrect results for page 1.

When 3 tasks exist and the request is:

GET /tasks?page=1&limit=2

the service returns the third task instead of the first two tasks.

The API route also returns an empty array when only 2 tasks exist.

### How I Discovered It

I wrote unit and integration tests for pagination.

The tests failed with:

- Expected 2 tasks but received 0 from the API.
- The service returned Task 3 instead of Task 1 and Task 2.

The failing tests were:

- `Task Service › should paginate tasks`
- `Tasks API › GET /tasks should support pagination`

### Root Cause

The pagination logic in `src/services/taskService.js` calculates the offset as:

```js
const offset = page * limit;