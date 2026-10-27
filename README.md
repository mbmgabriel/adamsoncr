# Installation
Create `.env` file
```bash
  cp .env.sample .env
```


Edit `.env` file and provide required credentials
```bash
  nano .env`
```

Install packages
```bash
npm install
```

Start the server
```bash
npm start
```

## Local review testing

The local MySQL database runs through `compose.local.yml` and persists in a Docker
volume. It listens on `127.0.0.1:3306`. In the backend `.env`, set `DB_HOST=127.0.0.1`,
`DB_DIALECT=mysql`, `DB_DATABASE=adamsoncr_local`, `DB_USERNAME=adamson_local`, and
choose values for `DB_PASSWORD` and `LOCAL_MYSQL_ROOT_PASSWORD`.

With Docker Desktop running:

```bash
npm run db:local:start
npm run db:migrate
npm run db:local:seed
npm start
```

The local seed command adds missing fixtures without resetting existing review
progress. It refuses non-local databases. Test accounts use password `password`:

| Role | Username |
| --- | --- |
| Administrator | local_admin |
| Researcher | local_researcher |
| Research Coordinator | local_rc |
| Chairperson | local_chair |
| Dean | local_dean |
| CRD Staff | local_crd_staff |
| CRD Director | local_crd_director |
| URB Member 1 | local_urb_1 |
| URB Member 2 | local_urb_2 |
| URB Member 3 | local_urb_3 |

Sample research titles start with `LOCAL TEST` and cover dean, CRD staff, and CRD
director review stages. Staff should see the staff and director fixtures; the
director should see only the director fixture until staff endorse another item.

In the sibling frontend's ignored `.env.development.local`, use
`REACT_APP_API_URL=http://localhost:3000`, `PORT=3002`, and `BROWSER=none`, then run
`npm start` there. Open `http://localhost:3002` to sign in with a test account.

See [the research workflow](docs/research-workflow.md) for revision, flexible URB assignment, approval, and completion behavior.


## Local admin portal

Keep the backend on port 3000 and set `FRONTEND_URL=http://localhost:3002` and `HOST=127.0.0.1` in the ignored backend `.env`. Keep the local database settings described above. Start Docker Desktop, then:

```bash
npm run db:local:start
npm run db:migrate
npm run db:local:seed
npm start
```

The seed command only adds missing fixtures and backfills college links. It does not reset existing accounts, passwords, or review progress. The frontend in `../adamsoncrfrontend` runs on port 3002 with `REACT_APP_API_URL=http://localhost:3000`. Sign in at `http://localhost:3002/admin` with `local_admin` / `password` on a normally seeded local database.

The admin migration creates colleges from existing department descriptions, preserving department IDs, user relationships, and investigator affiliation snapshots. Legacy groups that are offices or centers retain their existing names so an administrator can reorganize them deliberately. Blank descriptions remain unassigned for correction in the department editor. Records are deactivated rather than deleted.

Run the checks against the local database:

```bash
npm run test:research
npm run test:admin:local
npm run test:notifications:local
```

The admin integration test starts its own ephemeral API, verifies authorization, duplicate rules, last-admin protection, college/department relationships, account activation, publication, application inspection, exports, audit, and CORS, then removes only the fixtures it created. It refuses a non-local database.

See [admin API behavior](docs/admin-portal.md). No production deployment or production migration is performed by local startup.


## Development runtime

Use `npm run start:development` to run the local API explicitly in development mode with nodemon auto-reload. The existing local `.env` selects `adamsoncr_local`, port 3000, loopback binding, and frontend origin `http://localhost:3002`. Production remains available through `npm run start:production`. Starting either service does not run database migrations or seed/reset data.

## Project monitoring

The F-CRD-003 monitoring module follows director approval completion. Setup, permissions, private uploads, progress rules, and verification commands are documented in [docs/project-monitoring.md](docs/project-monitoring.md).

## Multi-researcher demo data

Run `npm run db:local:demo` after the local migrations and base fixtures to add completed/in-progress research and monitoring, plus pending/approved assistance and incentive forms for `demo_anna`, `demo_carlo`, and `demo_mia` (local password `password`). The script is additive and restricted to `adamsoncr_local` on localhost. See [the dataset guide](docs/local-demo-data.md) and [record manifest](docs/local-demo-manifest.json).
