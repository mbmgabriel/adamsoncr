# Admin portal API

All `/api/v1/admin/*` endpoints require a bearer token for an active account whose current database role is Administrator. Cached browser roles do not grant API access. Authentication uses the existing UserAccount identity, independently of the User profile ID.

| Endpoint | Behavior |
| --- | --- |
| GET /admin/session | Verified administrator, organization records, roles, and status choices |
| GET /admin/overview | Live account, organization, and application counts |
| GET /admin/users, /admin/colleges, /admin/departments, /admin/content | Searchable lists; `q` and `page` parameters, 20 rows per page |
| POST /admin/users, /admin/colleges, /admin/departments, /admin/content | Create a record |
| PUT /admin/{resource}/{id} | Update a record using the same editable fields as creation |
| GET /admin/applications | Read-only application list |
| GET /admin/applications/{research,assistance,incentive}/{id} | Details, documents or attachments, and review history |
| GET /admin/reports/export | CSV of all matching applications, with spreadsheet formula escaping |
| GET /admin/audit | Searchable administrator action history |
| GET /organization | Authenticated active colleges and departments with stable IDs |
| GET /site-content | Authenticated published website content |

Application lists and exports accept `q`, `type`, `status` (status ID), `college_id`, `department_id`, `from`, and `to` (ISO calendar dates, inclusive). Organization reporting uses the submitting user's current affiliation; investigator text in existing submissions remains historical. Counts and exports use the same filtering logic. Dates are stored by the existing application conventions.

College fields: `name`, optional `initials`, and boolean `active`. Department fields: `dept_name`, optional `dept_initials`, `college_id`, and boolean `active`. Names are trimmed; duplicate college names and duplicate department names within a college are rejected without case sensitivity. A department must link to one college. An active department requires an active college. A college cannot be deactivated while any linked department is active.

User fields: `username`, `email`, `first_name`, `middle_name`, `last_name`, `contact_number`, `role_id`, optional `dept_id`, and boolean `active`. Creation additionally requires a password of at least eight characters; passwords are hashed using bcrypt. Assignment uses existing roles. The last active administrator cannot be demoted or deactivated. Inactive accounts cannot log in or reuse existing tokens. Deactivation retains profile and application history. Existing inactive affiliations can remain while editing a profile, but new assignments must use active records.

Content fields: `kind` (`homepage`, `about`, `contact`, `faq`, or `announcement`), `title`, plain-text `body`, and boolean `published`. Homepage, about, and contact have one editable record each. FAQs and announcements permit multiple records. Saving a record with `published=false` makes it a draft; it is not included in `/site-content`.

Admin mutations and their audit entries commit in the same transaction. Audit includes actor, action, record identity, and changed fields. Passwords and tokens are excluded. Automatic department description updates when renaming a college are represented by the college rename action.

Legacy role, department, and account management mutations cannot bypass the audited admin endpoints. Password and profile-picture self-service endpoints are restricted to the authenticated account. Administrators have read-only application access, including through legacy mutation URLs. Existing reviewer and director permissions remain in effect.

API errors include a human-readable `message`. Invalid input returns 400, missing authentication 401, forbidden access 403, missing records 404, and duplicate or relationship conflicts 409.
