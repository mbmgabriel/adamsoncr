const db = require('../../models');
const bcrypt = require('bcrypt');
const fail = (status, message) => {
  const e = new Error(message);
  e.status = status;
  throw e;
};
const text = value => String(value == null ? '' : value).trim();
const key = value => text(value).toLowerCase();
const accountFields = ['id', 'username', 'email', 'role_id', 'active', 'created_at'];
const resources = {
  colleges: db.Colleges,
  departments: db.Departments,
  users: db.UserAccount,
  content: db.SiteContent
};
const run = fn => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (e) {
    res.status(e.status || (e.name === 'SequelizeUniqueConstraintError' ? 409 : 500)).json({
      message: e.status ? e.message : e.name === 'SequelizeUniqueConstraintError' ?
        'A record with these details already exists.' : 'The operation could not be completed.'
    });
  }
};
const profileInclude = [{
  model: db.User,
  include: [{
    model: db.Departments
  }]
}, {
  model: db.UserRole
}];
const page = (rows, req) => {
  const size = 20;
  const current = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  return {
    rows: rows.slice((current - 1) * size, current * size),
    total: rows.length,
    page: current,
    pageSize: size
  };
};
const match = (rows, q) => !text(q) ? rows : rows.filter(row => JSON.stringify(row).toLowerCase().includes(
  key(q)));
async function audit(req, transaction, resource, id, before, after) {
  const changes = {};
  for (const field of new Set([...Object.keys(before || {}), ...Object.keys(after || {})])) {
    if (['password', 'token', 'created_at', 'updated_at', 'deleted_at'].includes(field)) continue;
    if (JSON.stringify(before?.[field]) !== JSON.stringify(after?.[field])) changes[field] = {
      before: before?.[field] ?? null,
      after: after?.[field] ?? null
    };
  }
  await db.AdminAudit.create({
    actor_id: req.user.id,
    actor_name: req.user.username,
    action: before ? 'update' : 'create',
    resource,
    resource_id: id,
    changes: JSON.stringify(changes)
  }, {
    transaction
  });
}
async function organization() {
  const [colleges, departments, roles, statuses] = await Promise.all([db.Colleges.findAll({
    order: [
      ['name', 'ASC']
    ]
  }), db.Departments.findAll({
    order: [
      ['dept_name', 'ASC']
    ]
  }), db.UserRole.findAll({
    attributes: ['id', 'role_name']
  }), db.StatusTables.findAll({
    attributes: ['id', 'status']
  })]);
  return {
    colleges,
    departments,
    roles,
    statuses
  };
}
async function applications(req) {
  const specs = [
    ['research', db.Research, 'title', 1],
    ['assistance', db.RequestAssistanceForms, 'research_paper_title', 2],
    ['incentive', db.IncentiveForms, 'title_of_work', 3]
  ];
  const [profiles, statuses] = await Promise.all([db.User.findAll({
    include: [db.Departments]
  }), db.StatusTables.findAll()]);
  const owners = new Map(profiles.map(p => [p.id, p]));
  const statusNames = new Map(statuses.map(s => [s.id, s.status]));
  let rows = [];
  for (const [type, model, titleField, formType] of specs) {
    if (req.query.type && req.query.type !== type) continue;
    const records = await model.findAll({
      order: [
        ['id', 'DESC']
      ]
    });
    const endorsements = await db.Endorsements.findAll({
      where: {
        form_type_id: formType
      }
    });
    rows.push(...records.map(r => {
      const owner = type === 'research' ? owners.get(r.created_by) : profiles.find(p => p
        .user_account_id === r.created_by);
      const decisions = endorsements.filter(e => e.research_id === r.id);
      const statusId = [10, 11].includes(Number(r.status_id)) || type === 'research' ? r.status_id :
        decisions.find(e => [10, 11].includes(Number(e.status_id)))?.status_id || r.status_id;
      return {
        id: r.id,
        type,
        title: r[titleField] || '(Untitled)',
        status_id: statusId,
        status: statusNames.get(statusId) || 'Pending',
        applicant: [owner?.first_name, owner?.last_name].filter(Boolean).join(' ') || r
          .name_of_authors || r.name_of_presenter || '',
        college_id: owner?.Department?.college_id || null,
        college: owner?.Department?.dept_desc || '',
        department_id: owner?.dept_id || null,
        department: owner?.Department?.dept_name || '',
        submitted_at: r.submitted_date || r.created_at,
        approved_amount: r.approved_amount
      };
    }));
  }
  const date = v => new Date(v).getTime();
  if (req.query.from && !Number.isFinite(date(req.query.from))) fail(400, 'Choose a valid start date.');
  if (req.query.to && !Number.isFinite(date(req.query.to))) fail(400, 'Choose a valid end date.');
  rows = rows.filter(r => (!req.query.status || String(r.status_id) === req.query.status) && (!req.query
    .college_id || String(r.college_id) === req.query.college_id) && (!req.query.department_id ||
    String(r.department_id) === req.query.department_id) && (!req.query.from || date(r.submitted_at) >=
    date(req.query.from)) && (!req.query.to || date(r.submitted_at) < date(req.query.to) + 86400000));
  return match(rows, req.query.q).sort((a, b) => date(b.submitted_at) - date(a.submitted_at));
}
const Admin = {
  session: run(async req => ({
    account: {
      id: req.user.id,
      username: req.user.username
    },
    ...(await organization())
  })),
  overview: run(async req => {
    const rows = await applications({
      query: {}
    });
    return {
      users: await db.UserAccount.count(),
      colleges: await db.Colleges.count({
        where: {
          active: true
        }
      }),
      departments: await db.Departments.count({
        where: {
          active: true
        }
      }),
      applications: rows.length,
      pending: rows.filter(r => !['2', '10', '11'].includes(String(r.status_id))).length,
      byType: ['research', 'assistance', 'incentive'].map(type => ({
        type,
        total: rows.filter(r => r.type === type).length
      }))
    };
  }),
  list: run(async req => {
    const model = resources[req.params.resource];
    if (!model) fail(404, 'Unknown resource.');
    const options = {
      order: [
        ['id', 'DESC']
      ]
    };
    if (req.params.resource === 'users') Object.assign(options, {
      attributes: accountFields,
      include: profileInclude
    });
    let rows = (await model.findAll(options)).map(r => r.toJSON());
    if (req.params.resource === 'content') rows = rows.filter(row => row.kind !== 'contact');
    return page(match(rows, req.query.q), req);
  }),
  save: run(async req => db.sequelize.transaction(async transaction => {
    const resource = req.params.resource;
    const model = resources[resource];
    if (!model) fail(404, 'Unknown resource.');
    // Serialize user changes on the role row to keep last-admin checks safe under concurrency.
    if (resource === 'users') await db.UserRole.findAll({
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    const record = req.params.id ? await model.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    }) : null;
    if (req.params.id && !record) fail(404, 'Record not found.');
    const before = record?.toJSON();
    let values = {};
    const body = req.body;
    const active = body.active === undefined ? (record ? record.active : true) : body.active;
    if (resource !== 'content' && typeof active !== 'boolean') fail(400,
      'Active must be true or false.');
    if (resource === 'colleges') {
      const name = text(body.name);
      if (!name || name.length > 255) fail(400, 'Enter a college name (up to 255 characters).');
      const duplicate = await model.findOne({
        where: {
          name_key: key(name)
        },
        transaction
      });
      if (duplicate && duplicate.id !== record?.id) fail(409, 'This college already exists.');
      if (!active && await db.Departments.count({
          where: {
            college_id: record?.id || 0,
            active: true
          },
          transaction
        })) fail(409, 'Deactivate the active departments in this college first.');
      values = {
        name,
        name_key: key(name),
        initials: text(body.initials),
        active
      };
    } else if (resource === 'departments') {
      const name = text(body.dept_name);
      if (!name || name.length > 255) fail(400,
      'Enter a department name (up to 255 characters).');
      const college = await db.Colleges.findByPk(body.college_id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!college || (active && !college.active)) fail(400, 'Select an active college.');
      const siblings = await model.findAll({
        where: {
          college_id: college.id
        },
        transaction
      });
      if (siblings.some(d => d.id !== record?.id && key(d.dept_name) === key(name))) fail(409,
        'This department already exists in the selected college.');
      values = {
        dept_name: name,
        dept_initials: text(body.dept_initials),
        dept_desc: college.name,
        college_id: college.id,
        active,
        updated_by: req.user.id
      };
      if (!record) values.created_by = req.user.id;
    } else if (resource === 'users') {
      const username = text(body.username),
        email = text(body.email);
      if (!username || username.length > 255 || !text(body.first_name) || !text(body.last_name) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400,
        'Username, first name, last name, and a valid email are required.');
      const existingUsername = await db.UserAccount.findOne({
        where: {
          username
        },
        transaction
      });
      if (existingUsername && existingUsername.id !== record?.id) fail(409,
        'This username already exists.');
      const role = await db.UserRole.findByPk(body.role_id, {
        transaction
      });
      if (!role) fail(400, 'Select an existing role.');
      const oldProfile = record ? await db.User.findOne({
        where: {
          user_account_id: record.id
        },
        transaction
      }) : null;
      const profileBefore = oldProfile ? Object.fromEntries(['first_name', 'middle_name',
        'last_name', 'contact_number', 'dept_id'
      ].map(k => [k, oldProfile[k]])) : null;
      const department = body.dept_id ? await db.Departments.findByPk(body.dept_id, {
        transaction
      }) : null;
      const college = department?.college_id ? await db.Colleges.findByPk(department.college_id, {
        transaction
      }) : null;
      if (body.dept_id && (!department || ((!department.active || !college?.active) && oldProfile
          ?.dept_id !== department.id))) fail(400, 'Select a department in an active college.');
      const oldRole = record ? await db.UserRole.findByPk(record.role_id, {
        transaction
      }) : null;
      if (record?.active && oldRole?.role_name === 'Administrator' && (!active || role
          .role_name !== 'Administrator')) {
        const count = await db.UserAccount.count({
          where: {
            role_id: record.role_id,
            active: true
          },
          transaction
        });
        if (count <= 1) fail(409,
          'The last active administrator cannot be deactivated or demoted.');
      }
      values = {
        username,
        email,
        role_id: role.id,
        active,
        updated_by: req.user.id
      };
      if (!record) {
        if (typeof body.password !== 'string' || body.password.length < 8) fail(400,
          'Initial password must contain at least 8 characters.');
        values.password = await bcrypt.hash(body.password, 10);
        values.created_by = req.user.id;
      }
      const account = record ? await record.update(values, {
        transaction
      }) : await model.create(values, {
        transaction
      });
      const profile = {
        first_name: text(body.first_name),
        middle_name: text(body.middle_name),
        last_name: text(body.last_name),
        contact_number: text(body.contact_number),
        dept_id: department?.id || null,
        updated_by: req.user.id
      };
      if (oldProfile) await oldProfile.update(profile, {
        transaction
      });
      else await db.User.create({
        ...profile,
        user_account_id: account.id,
        created_by: req.user.id
      }, {
        transaction
      });
      await audit(req, transaction, resource, account.id, before ? {
        ...before,
        profile: profileBefore
      } : null, {
        ...account.toJSON(),
        profile
      });
      return {
        id: account.id
      };
    } else {
      if (!['homepage', 'about', 'faq', 'announcement'].includes(body.kind)) fail(400,
        'Choose a supported content type.');
      if (!text(body.title) || text(body.title).length > 255 || typeof body.body !== 'string' ||
        body.body.length > 60000 || typeof body.published !== 'boolean') fail(400,
        'Enter a title, body (up to 60,000 characters), and publication status.');
      if (record?.kind === 'contact') fail(400, 'Contact information is managed by the website footer.');
      if (['homepage', 'about'].includes(body.kind)) {
        const existing = await model.findOne({
          where: {
            kind: body.kind
          },
          transaction
        });
        if (existing && existing.id !== record?.id) fail(409,
          'Edit the existing page for this content type.');
      }
      values = {
        kind: body.kind,
        title: text(body.title),
        body: body.body,
        published: body.published
      };
    }
    const saved = record ? await record.update(values, {
      transaction
    }) : await model.create(values, {
      transaction
    });
    if (resource === 'colleges') await db.Departments.update({
      dept_desc: saved.name
    }, {
      where: {
        college_id: saved.id
      },
      transaction
    });
    await audit(req, transaction, resource, saved.id, before, saved.toJSON());
    return {
      id: saved.id
    };
  })),
  applications: run(async req => page(await applications(req), req)),
  detail: run(async req => {
    const spec = {
      research: [db.Research, [db.ResearchInvestigators, db.ResearchPurpose,
        {model:db.ResearchDocuments,include:[db.DocumentTypes]},
        {model:db.BudgetBreakdowns,include:[db.BudgetBreakdownDetails]}], 1],
      assistance: [db.RequestAssistanceForms, [{model:db.CAssistanceFormProofs,include:[db.SAssistanceFormProofs]}], 2],
      incentive: [db.IncentiveForms, [db.SIncentiveTypes,db.SPeerReviewProof,
        {model:db.CAttachmentInfos,include:[db.SAttachmentInfos]}], 3]
    }[req.params.type];
    if (!spec) fail(404, 'Unknown application type.');
    const record = await spec[0].findByPk(req.params.id, {
      include: spec[1]
    });
    if (!record) fail(404, 'Application not found.');
    const history = await db.Endorsements.findAll({
      where: {
        research_id: record.id,
        form_type_id: spec[2]
      },
      include: [{
        model: db.User,
        include: [{
          model: db.UserAccount,
          attributes: ['id', 'role_id'],
          include: [{
            model: db.UserRole,
            attributes: ['role_name']
          }]
        }]
      }]
    });
    const versions = req.params.type === 'research' ? await db.ResearchVersions.findAll({
      where: {
        research_id: record.id
      },
      attributes: ['id', 'version_number', 'created_at', 'snapshot']
    }) : [];
    return {
      record,
      categories: req.params.type === 'research' ? await db.ResearchCategory.findAll({
        where:{id:String(record.category || '').split(',').map(Number).filter(Number.isInteger)},
        attributes:['id','research_name']
      }) : [],
      history,
      versions: versions.map(version => ({
        id: version.id, version_number: version.version_number, created_at: version.created_at,
        reviews: (JSON.parse(version.snapshot).endorsements || []).map(entry => ({
          reviewer: [entry.User?.first_name, entry.User?.last_name].filter(Boolean).join(' '),
          status_id: entry.status_id, remarks: entry.remarks, reviewed_at: entry.updated_at,
        })),
      }))
    };
  }),
  audit: run(async req => page(match((await db.AdminAudit.findAll({
    order: [
      ['id', 'DESC']
    ]
  })).map(r => r.toJSON()), req.query.q), req)),
  report: async (req, res) => {
    try {
      const rows = await applications(req);
      const fields = ['type', 'id', 'title', 'applicant', 'status', 'college', 'department',
        'submitted_at', 'approved_amount'
      ];
      const cell = v => '"' + String(v ?? '').replace(/^(?:\s*[=+@-]|[\t\r\n])/, "'$&").replace(/"/g,
        '""') + '"';
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="research-report.csv"');
      res.send('\uFEFF' + [fields, ...rows.map(r => fields.map(f => r[f]))].map(row => row.map(cell).join(
        ',')).join('\r\n'));
    } catch (e) {
      res.status(e.status || 500).json({
        message: e.status ? e.message : 'Report could not be generated.'
      });
    }
  },
  published: run(async () => ({
    rows: await db.SiteContent.findAll({
      where: {
        published: true
      },
      attributes: ['id', 'kind', 'title', 'body'],
      order: [
        ['id', 'ASC']
      ]
    })
  })),
  lookups: run(async () => {
    const data = await organization();
    return {
      colleges: data.colleges.filter(c => c.active),
      departments: data.departments.filter(d => d.active && data.colleges.some(c => c.id === d
        .college_id && c.active))
    };
  })
};
module.exports = Admin;
