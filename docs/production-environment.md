# Production environment

On the deployment server, copy `.env.production.example` to `.env` and replace
every `CHANGE_ME` value. The application loads `.env`; it does not automatically
load `.env.production`. Alternatively, inject variables using the hosting
platform's environment settings or secret manager.

Rotate the database password and JWT secret previously shared in chat. Create a
dedicated SQL Server application login instead of using `sa`. Generate the new
JWT secret with `openssl rand -hex 32`; replacing it invalidates existing tokens.
Use a separate deployment account for schema migrations when the application
account does not have DDL permissions.

Set `DB_HOST` to the SQL Server DNS name matching its trusted certificate and
confirm `DB_PORT` with the database administrator. SQL Server connections enable
encryption and certificate validation by default. Configure a trusted server
certificate rather than disabling validation. Restrict database network access
to the backend server or private network.

Set `BASE_URL` to the public API hostname without a scheme or path and
`HTTP_PROTOCOL=https`. Set `FRONTEND_URL` to the exact public HTTPS origin,
including the scheme and without a trailing slash. Production CORS uses this
origin. `BASE_URL` and `HTTP_PROTOCOL` are currently informational: the Node
server uses HTTP internally. Configure a reverse proxy or hosting load balancer
to terminate HTTPS and forward traffic to port 3008; restrict direct access to
that port. Point the deployed frontend's API URL at the public HTTPS API.

Install dependencies with `npm ci --omit=dev`, run reviewed database migrations
under the deployment environment, then start with `npm run start:production`
on a POSIX host. On Windows, set `NODE_ENV=production` in the host environment
and run `node ./bin/www`. Configure the hosting platform to restart the process
after failures and persist uploaded files under `storage`.

AWS and MailerSend values can remain empty only for features that do not use
those services. Supply the region and bucket for S3 and the API key for email
when those integrations are enabled. Prefer a workload IAM role over static AWS
keys where supported.

This prepares environment configuration; it is not a complete production
security review. Review public `/api-docs` and static `storage` access, dependency
security, upload limits, authentication protections, backups, and monitoring
before launch. No production database connections or migrations were performed
while preparing this configuration.

For project monitoring, also persist and back up `private_uploads/monitoring` alongside its database metadata. Keep this directory outside any public static route. Apply the project-monitoring migration before starting this backend version.
