# Local demo dataset

Synthetic fixtures for `adamsoncr_local` only. Created by `npm run db:local:demo` in the backend repository. Existing records and edits to these demo rows are preserved on rerun. No reset is performed.

All three researcher accounts use local test password `password`.

| Username | Name | In-progress monitoring | Completed monitoring |
| --- | --- | --- | --- |
| demo_anna | Anna Reyes | [32%](http://localhost:3002/project-monitoring/16) | [100%](http://localhost:3002/project-monitoring/17) |
| demo_carlo | Carlo Santos | [64%](http://localhost:3002/project-monitoring/18) | [100%](http://localhost:3002/project-monitoring/19) |
| demo_mia | Mia Cruz | [16%](http://localhost:3002/project-monitoring/20) | [100%](http://localhost:3002/project-monitoring/21) |

Each researcher has:

- One ongoing research approval (at coordinator, dean, or staff review).
- Two approved research records: one in-progress monitoring checklist and one completed checklist.
- One pending and one approved presentation assistance request.
- One pending and one approved publication incentive request.

Total: 3 accounts, 9 research records, 6 monitoring projects, 6 assistance requests, and 6 incentive requests. Every title begins with `DEMO -`. Approved support requests have sample approved amounts. Completed monitoring unlocks PDF and clearance actions; clearance forms are left blank for researcher testing.

No documents or office signatures are fabricated. Monitoring fixture remarks identify requirements as offline-verified sample data. Research approvals/endorsements are synthetic test states, not decisions on real submissions. Local review accounts (`local_rc`, `local_chair`, `local_dean`, `local_crd_staff`, `local_crd_director`, and URB accounts) retain their existing authority and passwords.

See `local-demo-manifest.json` for IDs and project URLs. The script refuses hosted databases and production mode.
