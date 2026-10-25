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
`REACT_APP_API_URL=http://localhost:3000`, `PORT=3001`, and `BROWSER=none`, then run
`npm start` there. Open `http://localhost:3001` to sign in with a test account.

See [the research workflow](docs/research-workflow.md) for revision, flexible URB assignment, approval, and completion behavior.
