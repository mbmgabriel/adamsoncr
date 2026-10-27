'use strict';
module.exports={
  async up(q,S){
    const id=()=>({type:S.INTEGER,primaryKey:true,autoIncrement:true,allowNull:false});
    const timestamps=()=>({created_at:{type:S.DATE,allowNull:false},updated_at:{type:S.DATE,allowNull:false},deleted_at:S.DATE});
    await q.createTable('monitoring_projects',{id:id(),research_id:{type:S.INTEGER,allowNull:false,unique:true,references:{model:'research',key:'id'}},owner_account_id:{type:S.INTEGER,allowNull:false},form_version:{type:S.STRING,allowNull:false},snapshot:{type:S.TEXT,allowNull:false},...timestamps()});
    await q.createTable('monitoring_items',{id:id(),project_id:{type:S.INTEGER,allowNull:false,references:{model:'monitoring_projects',key:'id'}},key:{type:S.STRING(80),allowNull:false},section:{type:S.STRING(40),allowNull:false},label:{type:S.STRING,allowNull:false},position:{type:S.INTEGER,allowNull:false},requires_file:{type:S.BOOLEAN,allowNull:false},conditional:{type:S.BOOLEAN,allowNull:false},status:{type:S.STRING(20),allowNull:false,defaultValue:'pending'},submitted_on:S.DATEONLY,returned_on:S.DATEONLY,remarks:S.TEXT,revision:{type:S.INTEGER,allowNull:false,defaultValue:0},...timestamps()});
    await q.addIndex('monitoring_items',['project_id','key'],{unique:true,name:'monitoring_project_item_key'});
    await q.createTable('monitoring_attachments',{id:id(),item_id:{type:S.INTEGER,allowNull:false,references:{model:'monitoring_items',key:'id'}},filename:{type:S.STRING,allowNull:false},storage_key:{type:S.STRING,allowNull:false},content_type:{type:S.STRING,allowNull:false},byte_size:{type:S.INTEGER,allowNull:false},created_by:{type:S.INTEGER,allowNull:false},...timestamps()});
    await q.createTable('monitoring_events',{id:id(),project_id:{type:S.INTEGER,allowNull:false,references:{model:'monitoring_projects',key:'id'}},item_id:S.INTEGER,actor_id:S.INTEGER,actor_name:S.STRING,action:{type:S.STRING,allowNull:false},changes:S.TEXT,...timestamps()});
  },
  async down(q){for(const table of ['monitoring_events','monitoring_attachments','monitoring_items','monitoring_projects'])await q.dropTable(table);}
};
