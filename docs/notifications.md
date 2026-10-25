# In-app notifications

Every authenticated account has a private inbox. Research notifications follow the
existing assigned reviewer sequence; assistance and incentive submissions notify
assigned CRD directors. Applicants receive decisions, research progress, revision
remarks, assignment changes and completion. No unrelated roles receive broadcasts.

## Deployment

Deploy the backend and frontend together. First ensure the existing migrations
creating `notifications` and `research_versions` are applied. Then apply the new
schema migration using the deployed backend's environment:

```sh
npm run db:migrate -- --name 20261025160000-enable-notification-inbox.js --env production
```

Restart the backend, deploy the frontend, and create current pending-work alerts:

```sh
npm run notifications:backfill
```

The command uses the backend's configured database. Run one instance at a time.
It locks one application at a time and can be rerun: the same pending action does
not generate another notification. It includes applicants awaiting revisions and
skips completed applications. It does not recreate old event histories or alter
application statuses. Existing notification rows are preserved by the migration.
Back up the database under the normal deployment process before schema changes.

On the local development database, use the same commands without `--env production`.
No production migration or deployment is performed by the local test commands.

## API

All routes require the existing bearer token. Recipient identity always comes
from that token, never a client-supplied user ID.

- `GET /api/v1/notifications?limit=20&cursor=...&unread=true` returns
  `{ notifications, next_cursor, unread_count }`. Limits are 1–50. Notifications
  are ordered by creation timestamp then ID descending; unread count covers the
  entire inbox. Each item exposes ID, message (`notification`), event type,
  application type/ID, local `target_path`, read status and creation timestamp.
- `PATCH /api/v1/notifications/:id/read` marks an owned item read. An item belonging
  to another account returns 404. Repeated calls succeed without double counting.
- `PATCH /api/v1/notifications/read-all` marks this account's existing items read.

Read status is 0 for unread and 1 for read; legacy NULL values count as unread.
New notifications include unique deduplication keys. Mutations and notifications
commit in one transaction; unexpected insertion errors roll back the action.
The dashboard shows 10 recent items, the bell five, and `/notifications` provides
20 items per page with unread filtering and read controls. Notifications refresh
every 30 seconds while visible, on focus, and after successful application actions.
Application routes enforce ownership/assignment; removed targets report unavailable.

## Validation

```sh
npm run test:research
npm run test:notifications:local
npm run test:research:local
```

The notification integration test refuses non-local databases, starts its own HTTP
server, and cleans up its temporary users and applications. It checks differing
profile/account IDs, ordered recipients, minor and major revisions, multiple URB
reviewers, rollback, backfill reruns, both director-reviewed request types,
cross-account denial, stable pagination and idempotent read controls.

After deployment, verify an applicant/reviewer flow and inspect application logs
for notification failures. Missing migrations cause notification requests or
application mutations to fail rather than silently dropping alerts. The frontend
shows a retryable error, never example notifications.
