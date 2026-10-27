# Project monitoring

Monitoring follows F-CRD-003 (09-01-23). The approved research, researcher names,
college/department, and duration are copied into a historical snapshot. Approval
completion and monitoring completion remain separate: approval status is unchanged.

Director completion creates one monitoring project and its 25 checklist entries in
the approval transaction. A unique research ID prevents duplicate enrollment.
Opening the monitoring list also enrolls previously approved research, idempotently.
No checklist item is silently marked complete or not applicable during enrollment.

Roles 2, 6, and 7 can use the module. Researchers access only projects owned by their
account, can read dates/remarks/history, and upload documents to document requirements.
CRD staff and directors can inspect all monitored projects and update the form.
Other roles, including administrators and URB members, cannot use monitoring APIs.
Researcher ownership follows the submitting account, not coauthor names in the form.

The checklist includes separate entries for three funding tranches, two possible
extensions, three liquidation tranches, and each research clearance requirement.
Only conditional entries can be marked not applicable. Changes requested and not
applicable require remarks. Submitted and returned dates are calendar dates; a
returned date cannot precede a submitted date. New uploads set the Manila submission
date and clear the previous returned date; old reviews remain in monitoring history.

Progress is computed by the backend as completed / applicable checklist entries.
Uploading a file sets For review and does not complete a requirement. A replacement
file reopens its requirement for review, potentially reducing completion. CRD may
verify requirements against documents already collected during approval or offline;
marking complete does not require duplicating an existing approval attachment.
An all-excluded checklist is never reported as complete. Mandatory entries cannot
be excluded. Checklist completion represents verified requirements, not elapsed time.

Every save/upload includes the last observed item revision. Stale revisions return
409 so concurrent reviewers cannot silently overwrite one another. Checklist saves,
attachment metadata, and their change-history entries share a database transaction.

## API

All paths below are under `/api/v1`, authenticated with the existing bearer token.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /monitoring | Scope projects to the signed-in role and enroll existing approvals |
| GET | /monitoring/:id | Snapshot, checklist, file versions, progress, and latest 100 events |
| PUT | /monitoring/:id/items/:itemId | CRD update: status, remarks, submitted_on, returned_on, revision |
| POST | /monitoring/:id/items/:itemId/files | Owner submission: multipart file and revision |
| GET | /monitoring/:id/files/:fileId | Authorized, non-cacheable attachment download |

Upload one PDF, PNG, or JPEG at a time, up to 20 MB. File signatures are checked.
Files use generated names in `private_uploads/monitoring`, outside public `storage`.
Retain this directory with the database when moving or backing up the backend.
Original filenames are metadata only. File versions are preserved; a successful
upload never deletes an older attachment. Failed database saves clean up new files.

## Local setup and verification

Use only localhost and `adamsoncr_local` for development. Apply the additive
`20261028000000-project-monitoring.js` migration before starting updated code:

```bash
npm run db:local:start
npm run db:migrate
npm run start:development
```

In the frontend's ignored `.env.development.local`, set `REACT_APP_ENV=development`
and `REACT_APP_API_URL=http://localhost:3000`. Run `npm start` for port 3002, then
sign in with `local_researcher`, `local_crd_staff`, or `local_crd_director` using the
local fixture password `password`. Open `/project-monitoring` or its dashboard card.
Production credentials are not local fixture accounts.

```bash
npm run test:research
npm run test:monitoring:local
npm run test:research:local
npm run test:admin:local
npm run test:notifications:local
```

Monitoring integration tests reject non-local databases, start their own API server,
and clean up their temporary research, files, and checklist records. The approval
integration suite verifies automatic monitoring enrollment as part of the original
review workflow. Test database migrations separately on SQL Server staging before
any production rollout. Preserve `private_uploads` on the deployment host; do not
serve it through a public static route. No hosted migrations or deployment are part
of the local implementation.

## Completed monitoring and clearance documents

Apply the additive `20261029000000-monitoring-clearance.js` migration as well.
The completed checklist can be downloaded as a populated F-CRD-003 PDF. The
researcher then fills out F-CRD-006 Rev 1 (08-01-19), based on the supplied official
clearance form: completion date, college/department, two faculty/co-researcher
fields, and five student fields. At least one researcher must be entered.
Research title remains the approved historical title. Researcher names are shown
as reference; faculty/student classification is explicitly entered by the owner.

| Method | Path under /api/v1 | Purpose |
| --- | --- | --- |
| GET | /monitoring/:id/export | Consistent completed checklist data for PDF generation |
| GET | /monitoring/:id/clearance | Saved clearance or blank researcher fields |
| PUT | /monitoring/:id/clearance | Researcher owner saves fields with revision |
| GET | /monitoring/:id/clearance/export | Saved clearance data for PDF or printing |

All document routes require server-verified completed monitoring and the same
project ownership/role authorization. Clearance writes accept only researcher
fields; CRD staff/directors can read and print but cannot edit them. Revision checks
prevent lost updates. Saves are audited and stored in `monitoring_clearances`.
Exports are private and non-cacheable. PDFs are generated in the browser from
fresh authorized server snapshots; no external document service receives data.
Office checks, signatures, and clearance dates remain blank for responsible offices
to complete after printing. This form does not automatically certify clearance.

A new file submission or reopened requirement locks all document endpoints until
monitoring is complete again, while preserving the saved clearance details. Print
and download use saved values; unsaved frontend changes must be saved first.
