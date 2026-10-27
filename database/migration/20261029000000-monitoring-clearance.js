'use strict';
module.exports={
  async up(q,S){await q.createTable('monitoring_clearances',{
    id:{type:S.INTEGER,primaryKey:true,autoIncrement:true,allowNull:false},
    project_id:{type:S.INTEGER,allowNull:false,unique:true,references:{model:'monitoring_projects',key:'id'}},
    form_version:{type:S.STRING,allowNull:false},data:{type:S.TEXT,allowNull:false},
    revision:{type:S.INTEGER,allowNull:false,defaultValue:0},created_by:{type:S.INTEGER,allowNull:false},updated_by:{type:S.INTEGER,allowNull:false},
    created_at:{type:S.DATE,allowNull:false},updated_at:{type:S.DATE,allowNull:false},deleted_at:S.DATE
  });},
  async down(q){await q.dropTable('monitoring_clearances');}
};
