# Research review workflow

Research uses existing role IDs: researcher 2, coordinator 3, chairperson 4,
dean 5, CRD staff 6, CRD director 7, and URB member 8.

1. The researcher submits version 1.
2. The coordinator endorses or requests a revision with remarks. Revision sets
   research status 5. Only its researcher may edit and resubmit the application.
3. Resubmission archives the previous application and review decisions in
   `research_versions`, increments the version, resets endorsements, and returns
   the application to coordinator review. Supporting documents are retained.
4. Chairperson, dean, and CRD staff endorse in that order. These roles cannot
   request revisions.
5. After dean endorsement, CRD staff assigns two or more distinct active URB members using the
   existing URB assignment screen. Additional members can be assigned. A member
   who has already approved cannot be removed; retained decisions are preserved.
   Saving assignments also records the staff endorsement; a separate endorsement click is optional.
6. Only selected URB members see the research in their review queue and may
   approve it. Each member's approval is stored as endorsement status 6 and shown
   as Approved in the URB interface. Research remains status 3, For Approval.
7. A pending assigned URB reviewer may request minor revision with remarks,
   returning the research to its researcher with status 5. The researcher edits
   and resubmits directly to the same assigned URB members, with status 3 and no
   version increment. Departmental endorsements and files are retained. All URB
   decisions reset to pending so every member reviews the updated application.
   Previous remarks and decisions are archived under the same version number.
8. When every selected member has approved, the director can complete the research.
   This sets both the research and director final-step status to 2, Completed.
   Assigning URB reviewers keeps the director pending; it is not an endorsement.
   The displayed final sequence is URB 1, URB 2 (and any additional members), then
   CRD Director. Completion is never automatic.

Status 10, Approved, remains for assistance and incentive forms. Their workflow
is unchanged by these research-specific endpoints.

## API

All endpoints require the normal bearer token. IDs submitted in `member_ids` are
user profile IDs returned by `urb-members`, not account IDs.

| Method | Path under `/api/v1/research` | Purpose |
| --- | --- | --- |
| GET | `/urb-members` | CRD staff lists active URB members |
| GET | `/:id/workflow` | Current stage, available actions, selected members, raw application data |
| PUT | `/:id/review` | `{ "action": "endorse" / "request_revision" / "approve_urb", "remarks": "..." }` |
| PUT | `/:id/urb-members` | CRD staff assigns `{ "member_ids": [8, 9] }` (minimum two) |
| PUT | `/:id/resubmit` | Researcher submits revised application, investigators, and budget arrays |
| PUT | `/:id/complete` | Director completes after all URB approvals |

Workflow mutations run in a transaction and lock the research row to serialize
concurrent decisions. Older research endorsement routes also enforce these gates.
Generic research status and edit routes cannot skip the workflow. Existing
completed research remains completed; no live historical records are rewritten.

## Local testing and deployment

Run `npm run db:migrate` before using revisions; the new migration creates the
version-history table. Deploy frontend and backend together so both use the same
workflow. No live deployment is performed by the local setup.

`npm run db:local:seed` creates `local_urb_1`, `local_urb_2`, and `local_urb_3`, all
with the local-only password `password`, plus sample research at URB review and
completion stages. The assignment screen supports more members as accounts are
added; it has no fixed reviewer-slot limit.

Run `npm run test:research` for unit regressions and `npm run test:research:local`
for the local HTTP workflow check. The latter requires the local database, seed
accounts, and backend on port 3000; it removes its temporary research afterward.
