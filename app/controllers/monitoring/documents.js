const db=require('../../models');
const service=require('../../services/monitoring/service');
const version='F-CRD-006 Rev 1 (08-01-19)';
const run=fn=>async(req,res,next)=>{try{res.set('Cache-Control','private, no-store');res.json(await db.sequelize.transaction(transaction=>fn(req,transaction)));}catch(e){if(e.status)return res.status(e.status).json({message:e.message});next(e);}};
async function completed(req,transaction){
  // All checklist writers lock the project too, so the export is one consistent snapshot.
  const project=await service.access(req.user,req.params.id,transaction);
  const items=await db.MonitoringItem.findAll({where:{project_id:project.id},order:[['position','ASC']],transaction});
  const progress=service.progress(items);
  if(!progress.finished)service.fail(409,'Complete all applicable monitoring requirements before downloading forms or filling out clearance.');
  return {project:service.serialize(project),items:items.map(i=>i.toJSON()),progress,generated_at:new Date().toISOString()};
}
function serialize(record,project){
  return {saved:!!record,revision:record?.revision||0,form_version:version,updated_at:record?.updated_at||null,form:record?JSON.parse(record.data):{
    date_completed:'',college_department:[project.snapshot.college,project.snapshot.department].filter(Boolean).join(' / '),
    faculty_researchers:['',''],student_researchers:['','','','','']
  }};
}
function validate(body){
  const keys=['revision','date_completed','college_department','faculty_researchers','student_researchers'];
  if(!body||Object.keys(body).some(key=>!keys.includes(key)))service.fail(400,'Only researcher details can be entered. Office clearance and signatures must be completed by the responsible offices.');
  const text=(value,max)=>{if(typeof value!=='string'||value.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))service.fail(400,'Use valid text within the field limits.');return value.trim();};
  const date_completed=service.date(body.date_completed);
  if(!date_completed)service.fail(400,'Enter the date of completion.');
  const college_department=text(body.college_department,500);
  if(!college_department)service.fail(400,'Enter the college and department.');
  const names=(value,count)=>{if(!Array.isArray(value)||value.length!==count)service.fail(400,'Use the two faculty and five student researcher fields on the form.');return value.map(name=>text(name,150));};
  const faculty_researchers=names(body.faculty_researchers,2),student_researchers=names(body.student_researchers,5);
  if(![...faculty_researchers,...student_researchers].some(Boolean))service.fail(400,'Enter at least one faculty or student researcher.');
  return {date_completed,college_department,faculty_researchers,student_researchers};
}
module.exports={
  monitoring:run(completed),
  clearance:run(async(req,transaction)=>{
    const result=await completed(req,transaction);
    const record=await db.MonitoringClearance.findOne({where:{project_id:result.project.id},transaction});
    return {...result,clearance:serialize(record,result.project)};
  }),
  clearanceExport:run(async(req,transaction)=>{
    const result=await completed(req,transaction);
    const record=await db.MonitoringClearance.findOne({where:{project_id:result.project.id},transaction});
    if(!record)service.fail(409,'Save the researcher clearance details before printing or downloading.');
    return {...result,clearance:serialize(record,result.project)};
  }),
  save:run(async(req,transaction)=>{
    if(Number(req.user.role_id)!==2)service.fail(403,'Only the project researcher can fill out the clearance form.');
    const result=await completed(req,transaction),form=validate(req.body);
    let record=await db.MonitoringClearance.findOne({where:{project_id:result.project.id},transaction});
    service.checkRevision(record||{revision:0},req.body.revision);
    const before=record?JSON.parse(record.data):null;
    if(record)await record.update({data:JSON.stringify(form),revision:record.revision+1,updated_by:req.user.id},{transaction});
    else record=await db.MonitoringClearance.create({project_id:result.project.id,form_version:version,data:JSON.stringify(form),revision:1,created_by:req.user.id,updated_by:req.user.id},{transaction});
    await service.log(result.project.id,null,req.user,'clearance_saved',{before,after:form},transaction);
    return {...result,clearance:serialize(record,result.project),message:'Clearance details saved. You can now download or print the form.'};
  })
};
