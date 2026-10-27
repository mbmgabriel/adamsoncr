require('dotenv').config();
const assert = require('node:assert/strict');
const db = require('../app/models');
const bcrypt = require('bcrypt');
const app = require('../app');
if (!['127.0.0.1', 'localhost'].includes(process.env.DB_HOST) || process.env.DB_DATABASE !==
  'adamsoncr_local') throw new Error('Admin integration checks require adamsoncr_local on localhost.');
db.sequelize.options.logging = false;
let researchFixture;
let server, token, created = {
  colleges: [],
  departments: [],
  users: [],
  content: []
};
const prefix = `ADMIN TEST ${Date.now()}`;
let base;
async function request(path, method = 'GET', body, auth = token) {
  const response = await fetch(`${base}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? {
        Authorization: `Bearer ${auth}`
      } : {})
    },
    ...(body ? {
      body: JSON.stringify(body)
    } : {})
  });
  const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() :
    await response.text();
  return {
    status: response.status,
    data
  };
}
async function expectStatus(path, method, body, status, auth = token) {
  const r = await request(path, method, body, auth);
  assert.equal(r.status, status, `${method} ${path}: ${JSON.stringify(r.data)}`);
  return r.data;
}
async function create(resource, body) {
  const result = await expectStatus(`admin/${resource}`, 'POST', body, 200);
  created[resource].push(result.id);
  return result.id;
}
async function main() {
  await db.sequelize.authenticate();
  server = await new Promise(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
  const login = await expectStatus('user/login', 'POST', {
    username: 'local_admin',
    password: 'password'
  }, 200, null);
  token = login.token;
  await expectStatus('admin/session', 'GET', null, 401, null);
  const researcher = await expectStatus('user/login', 'POST', {
    username: 'local_researcher',
    password: 'password'
  }, 200, null);
  await expectStatus('admin/colleges', 'GET', null, 403, researcher.token);
  await expectStatus('admin/colleges', 'POST', {
    name: 'Unauthorized'
  }, 403, researcher.token);
  await expectStatus('departments/create', 'POST', {
    dept_name: 'Unauthorized'
  }, 403, researcher.token);
  await expectStatus('roles/1', 'PUT', {
    role_name: 'Forged'
  }, 403, researcher.token);
  await expectStatus('user/register', 'POST', {}, 403, researcher.token);
  const session = await expectStatus('admin/session', 'GET', null, 200);
  const adminId = login.UserAccount.user_account_id;
  const admin = await db.UserAccount.findByPk(adminId, {
    include: [db.User]
  });
  const originalAdmin = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role_id: admin.role_id,
    active: false,
    first_name: admin.User.first_name,
    last_name: admin.User.last_name,
    dept_id: admin.User.dept_id
  };
  const adminCount = await db.UserAccount.count({
    where: {
      role_id: admin.role_id,
      active: true
    }
  });
  if (adminCount === 1) {
    await expectStatus(`admin/users/${adminId}`, 'PUT', originalAdmin, 409);
    await expectStatus(`admin/users/${adminId}`, 'PUT', {
      ...originalAdmin,
      active: true,
      role_id: 2
    }, 409);
  }
  const collegeBody = {
    name: prefix + ' College',
    initials: 'TEST',
    active: true
  };
  const college = await create('colleges', collegeBody);
  await expectStatus('admin/colleges', 'POST', {
    ...collegeBody,
    name: ' ' + collegeBody.name.toUpperCase() + ' '
  }, 409);
  const departmentBody = {
    dept_name: prefix + ' Department',
    dept_initials: 'TD',
    college_id: college,
    active: true
  };
  const department = await create('departments', departmentBody);
  await expectStatus('admin/departments', 'POST', {
    ...departmentBody,
    dept_name: departmentBody.dept_name.toLowerCase()
  }, 409);
  await expectStatus(`admin/colleges/${college}`, 'PUT', {
    ...collegeBody,
    active: false
  }, 409);
  const username = `admin_test_${Date.now()}`;
  const userBody = {
    username,
    password: 'local-test-password',
    first_name: 'Local',
    last_name: 'Integration',
    email: `${username}@example.test`,
    role_id: 2,
    dept_id: department,
    active: true
  };
  const user = await create('users', userBody);
  const reloaded = await expectStatus('admin/users?q=' + username, 'GET', null, 200);
  assert.equal(reloaded.rows[0].User.dept_id, department);
  assert.equal(reloaded.rows[0].password, undefined);
  assert.equal(reloaded.rows[0].token, undefined);
  assert.ok(await bcrypt.compare(userBody.password, (await db.UserAccount.findByPk(user)).password));
  const newLogin = await expectStatus('user/login', 'POST', {
    username,
    password: userBody.password
  }, 200, null);
  await expectStatus(`admin/users/${user}`, 'PUT', {
    ...userBody,
    first_name: 'Updated',
    active: false
  }, 200);
  await expectStatus('organization', 'GET', null, 403, newLogin.token);
  await expectStatus('user/login', 'POST', {
    username,
    password: userBody.password
  }, 404, null);
  await expectStatus(`admin/users/${user}`, 'PUT', userBody, 200);
  const renamedCollege = {
    ...collegeBody,
    name: collegeBody.name + ' Renamed'
  };
  await expectStatus(`admin/colleges/${college}`, 'PUT', renamedCollege, 200);
  assert.equal((await db.Departments.findByPk(department)).dept_desc, renamedCollege.name);
  await expectStatus(`admin/departments/${department}`, 'PUT', {
    ...departmentBody,
    active: false
  }, 200);
  assert.equal((await db.User.findOne({
    where: {
      user_account_id: user
    }
  })).dept_id, department);
  const lookups = await expectStatus('organization', 'GET', null, 200);
  assert.ok(!lookups.departments.some(d => d.id === department));
  await expectStatus(`admin/colleges/${college}`, 'PUT', {
    ...renamedCollege,
    active: false
  }, 200);
  await expectStatus('admin/departments', 'POST', {
    ...departmentBody,
    dept_name: prefix + ' Blocked'
  }, 400);
  const contentList = await expectStatus('admin/content','GET',null,200);
  assert.ok(contentList.rows.every(row => row.kind !== 'contact'));
  await expectStatus('admin/content','POST',{kind:'contact',title:'Contact Us',body:'Legacy footer',published:true},400);
  const contentBody = {
    kind: 'faq',
    title: prefix + ' FAQ',
    body: 'A local draft for verification.',
    published: false
  };
  const content = await create('content', contentBody);
  assert.ok(!(await expectStatus('site-content', 'GET', null, 200)).rows.some(r => r.id === content));
  await expectStatus(`admin/content/${content}`, 'PUT', {
    ...contentBody,
    published: true
  }, 200);
  assert.ok((await expectStatus('site-content', 'GET', null, 200)).rows.some(r => r.id === content));
  const apps = await expectStatus('admin/applications', 'GET', null, 200);
  for (const row of apps.rows) await expectStatus(`admin/applications/${row.type}/${row.id}`, 'GET', null,
    200);
  if (apps.rows.find(r => r.type === 'research')) {
    const id = apps.rows.find(r => r.type === 'research').id;
    await expectStatus(`research/status/${id}/2`, 'PUT', {}, 403);
    await expectStatus(`research/${id}/review`, 'PUT', {
      action: 'endorse'
    }, 403);
  }
  const profile = await db.User.findOne({where:{user_account_id:user}});
  researchFixture = await db.Research.create({title:'='+prefix,created_by:profile.id,status_id:1,submitted_date:new Date(),version_number:'1'});
  const reportQuery = new URLSearchParams({q:prefix,type:'research',status:'1',college_id:String(college),department_id:String(department),from:'2020-01-01',to:'2099-12-31'});
  const filtered = await expectStatus('admin/applications?'+reportQuery,'GET',null,200);
  assert.equal(filtered.total,1);assert.equal(filtered.rows[0].id,researchFixture.id);
  const csv = await expectStatus('admin/reports/export?'+reportQuery,'GET',null,200);
  assert.ok(csv.includes('"title"'));assert.ok(csv.includes("'="+prefix));
  assert.equal(csv.split('\r\n').length,2);
  await expectStatus('admin/applications?from=invalid','GET',null,400);
  const allAudits = await expectStatus('admin/audit', 'GET', null, 200);
  const userAudits = allAudits.rows.filter(r => r.resource === 'users' && r.resource_id === user);
  const audits = {
    total: userAudits.length,
    rows: userAudits
  };
  assert.ok(audits.total >= 3);
  assert.ok(!JSON.stringify(audits).includes(userBody.password));
  assert.ok(audits.rows.some(r => r.changes.includes('Updated')));
  const origin = await fetch(`${base}/admin/session`, {
    headers: {
      Authorization: 'Bearer ' + token,
      Origin: 'http://localhost:3002'
    }
  });
  assert.equal(origin.headers.get('access-control-allow-origin'), 'http://localhost:3002');
  console.log(
    'PASS: admin access, legacy bypass prevention, last-admin protection, organization CRUD, persistence, activation, password hashing, content publishing, application details, read-only approval access, CSV, audit, and local CORS.'
    );
}
async function cleanup() {
  if (researchFixture) await db.Research.destroy({where:{id:researchFixture.id},force:true});
  for (const id of created.users) {
    await db.User.destroy({
      where: {
        user_account_id: id
      },
      force: true
    });
    await db.UserAccount.destroy({
      where: {
        id
      },
      force: true
    });
  }
  for (const [name, model] of [
      ['departments', db.Departments],
      ['colleges', db.Colleges],
      ['content', db.SiteContent]
    ])
    for (const id of created[name]) await model.destroy({
      where: {
        id
      },
      force: true
    });
  for (const [resource, resourceIds] of Object.entries(created))
    if (resourceIds.length) await db.AdminAudit.destroy({
      where: {
        resource,
        resource_id: resourceIds
      },
      force: true
    });
  if (server) await new Promise(resolve => server.close(resolve));
  await db.sequelize.close();
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
}).finally(cleanup);
