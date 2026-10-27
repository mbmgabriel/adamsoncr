"use strict";
module.exports = {
  async up(q, S) {
    const timestamps = () => ({
      created_at: {
        type: S.DATE,
        allowNull: false
      },
      updated_at: {
        type: S.DATE,
        allowNull: false
      },
      deleted_at: {
        type: S.DATE
      }
    });
    await q.createTable('colleges', {
      id: {
        type: S.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: S.STRING,
        allowNull: false
      },
      name_key: {
        type: S.STRING,
        allowNull: false,
        unique: true
      },
      initials: S.STRING,
      active: {
        type: S.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      ...timestamps()
    });
    await q.addColumn('departments', 'college_id', {
      type: S.INTEGER,
      references: {
        model: 'colleges',
        key: 'id'
      },
      allowNull: true
    });
    await q.addColumn('departments', 'active', {
      type: S.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await q.addColumn('user_accounts', 'active', {
      type: S.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    const [rows] = await q.sequelize.query('SELECT id, dept_desc FROM departments ORDER BY id');
    const colleges = new Map();
    for (const row of rows) {
      const name = String(row.dept_desc || '').trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (!colleges.has(key)) {
        await q.bulkInsert('colleges', [{
          name,
          name_key: key,
          active: true,
          created_at: new Date(),
          updated_at: new Date()
        }]);
        const [found] = await q.sequelize.query('SELECT id FROM colleges WHERE name_key = :key', {
          replacements: {
            key
          }
        });
        colleges.set(key, found[0].id);
      }
      await q.bulkUpdate('departments', {
        college_id: colleges.get(key)
      }, {
        id: row.id
      });
    }
    await q.createTable('site_contents', {
      id: {
        type: S.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kind: {
        type: S.STRING,
        allowNull: false
      },
      title: {
        type: S.STRING,
        allowNull: false
      },
      body: S.TEXT,
      published: {
        type: S.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      ...timestamps()
    });
    await q.createTable('admin_audits', {
      id: {
        type: S.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      actor_id: {
        type: S.INTEGER,
        allowNull: false
      },
      actor_name: S.STRING,
      action: S.STRING,
      resource: S.STRING,
      resource_id: S.INTEGER,
      changes: S.TEXT,
      ...timestamps()
    });
    const now = new Date();
    await q.bulkInsert('site_contents', [{
        kind: 'homepage',
        title: 'Take the lead',
        body: '— write, present, and publish your research to inspire change and drive innovation.',
        published: true,
        created_at: now,
        updated_at: now
      },
      {
        kind: 'about',
        title: 'About CRD',
        body: 'Adamson University Center for Research and Development',
        published: true,
        created_at: now,
        updated_at: now
      },
      {
        kind: 'contact',
        title: 'Contact Us',
        body: '2nd Flr., CoPoTy Bldg., Adamson University, 900 San Marcelino St., Ermita, Manila, Philippines 1000\nadu_crd@adamson.edu.ph\nDirect Line - (02) 85250604 Local - 8524-20-11 Loc. 153',
        published: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },
  async down(q) {
    await q.dropTable('admin_audits');
    await q.dropTable('site_contents');
    await q.removeColumn('user_accounts', 'active');
    await q.removeColumn('departments', 'active');
    await q.removeColumn('departments', 'college_id');
    await q.dropTable('colleges');
  }
};
