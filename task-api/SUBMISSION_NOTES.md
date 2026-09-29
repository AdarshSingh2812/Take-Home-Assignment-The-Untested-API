# Submission Notes

## What I Would Test Next

- More validation cases for task creation and updates.
- Invalid pagination values such as negative page numbers or limits.
- Boundary cases for due dates and overdue tasks.
- Concurrent requests to ensure task updates remain consistent.
- API behavior when receiving malformed JSON or unexpected request data.

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