const db=require('../../models');
const {checklist,progress}=require('./checklist');
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
async function log(projectId,itemId,actor,action,changes,transaction){
  await db.MonitoringEvent.create({project_id:projectId,item_id:itemId,actor_id:actor?.id,actor_name:actor?.username,action,changes:JSON.stringify(changes)},{transaction});
}
// Call with the research row locked. The same transaction protects approval and enrollment.
async function enroll(research,transaction,actor){
  if(Number(research.status_id)!==2)return null;
  let project=await db.MonitoringProject.findOne({where:{research_id:research.id},transaction});
  if(project)return project;
  const owner=await db.User.findByPk(research.created_by,{transaction});
  if(!owner)fail(409,'The approved research has no researcher profile.');
  const department=owner.dept_id?await db.Departments.findByPk(owner.dept_id,{transaction}):null;
  const investigators=await db.ResearchInvestigators.findAll({where:{research_id:research.id},transaction});
  const name=p=>[p.first_name,p.middle_name,p.last_name].filter(Boolean).join(' ');
  project=await db.MonitoringProject.create({research_id:research.id,owner_account_id:owner.user_account_id,form_version:'F-CRD-003 (09-01-23)',snapshot:JSON.stringify({title:research.title,researchers:[...new Set([name(owner),...investigators.map(name)].filter(Boolean))],college:department?.dept_desc||'',department:department?.dept_name||'',duration:research.research_duration||''})},{transaction});
  await db.MonitoringItem.bulkCreate(checklist.map(item=>({...item,project_id:project.id,status:'pending',revision:0})),{transaction});
  await log(project.id,null,actor,'enrolled',{research_id:research.id},transaction);
  return project;
}
async function syncApproved(account){
  const where={status_id:2};
  if(Number(account.role_id)===2){const profile=await db.User.findOne({where:{user_account_id:account.id}});if(!profile)return;where.created_by=profile.id;}
  const rows=await db.Research.findAll({where,attributes:['id']});
  for(const row of rows)await db.sequelize.transaction(async transaction=>{
    const research=await db.Research.findByPk(row.id,{transaction,lock:transaction.LOCK.UPDATE});
    if(research)await enroll(research,transaction,account);
  });
}
async function access(account,id,transaction){
  if(!/^\d+$/.test(String(id)))fail(404,'Project not found.');
  const project=await db.MonitoringProject.findByPk(id,{transaction,...(transaction?{lock:transaction.LOCK.UPDATE}:{})});
  if(!project)fail(404,'Project not found.');
  if(Number(account.role_id)===2&&project.owner_account_id!==account.id)fail(403,'This project does not belong to you.');
  const research=await db.Research.findByPk(project.research_id,{transaction});
  if(!research)fail(404,'Research not found.');
  if(Number(research.status_id)!==2)fail(409,'Monitoring requires completed approval.');
  return project;
}
async function itemFor(project,id,transaction){
  if(!/^\d+$/.test(String(id)))fail(404,'Requirement not found.');
  const item=await db.MonitoringItem.findOne({where:{id,project_id:project.id},transaction,...(transaction?{lock:transaction.LOCK.UPDATE}:{})});
  if(!item)fail(404,'Requirement not found.');return item;
}
function checkRevision(item,value){if(!['number','string'].includes(typeof value)||!Number.isSafeInteger(Number(value))||value===''||Number(value)!==item.revision)fail(409,'This requirement changed. Reload the project before saving.');}
function date(value){if(value===null||value==='')return null;if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)fail(400,'Use a valid calendar date.');return value;}
const serialize=project=>({...project.toJSON(),snapshot:JSON.parse(project.snapshot)});
const today=(now=new Date())=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const value=type=>parts.find(p=>p.type===type).value;return `${value('year')}-${value('month')}-${value('day')}`;};
module.exports={today,enroll,syncApproved,access,itemFor,checkRevision,date,fail,log,serialize,progress};
