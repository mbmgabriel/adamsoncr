const db=require('../../models');
const service=require('../../services/monitoring/service');
const fs=require('fs/promises');
const path=require('path');
const {randomUUID}=require('crypto');
const uploadRoot=path.resolve(__dirname,'../../../private_uploads/monitoring');
const fields=['id','item_id','filename','content_type','byte_size','created_by','created_at'];
const run=fn=>async(req,res,next)=>{try{res.json(await fn(req));}catch(e){if(e.status)return res.status(e.status).json({message:e.message});next(e);}};
const editor=req=>{if(![6,7].includes(Number(req.user.role_id)))service.fail(403,'Only CRD staff and directors can update the checklist.');};
const c={
  list:run(async req=>{
    await service.syncApproved(req.user);
    const projects=await db.MonitoringProject.findAll({where:Number(req.user.role_id)===2?{owner_account_id:req.user.id}:{},order:[['id','DESC']]});
    const result=[];
    for(const project of projects){const research=await db.Research.findByPk(project.research_id);if(!research||Number(research.status_id)!==2)continue;const items=await db.MonitoringItem.findAll({where:{project_id:project.id}});result.push({...service.serialize(project),progress:service.progress(items)});}
    return {projects:result};
  }),
  detail:run(async req=>{
    const project=await service.access(req.user,req.params.id);
    const items=await db.MonitoringItem.findAll({where:{project_id:project.id},order:[['position','ASC']]});
    const attachments=items.length?await db.MonitoringAttachment.findAll({where:{item_id:items.map(i=>i.id)},attributes:fields,order:[['id','DESC']]}):[];
    const events=await db.MonitoringEvent.findAll({where:{project_id:project.id},order:[['id','DESC']],limit:100});
    return {project:service.serialize(project),progress:service.progress(items),items:items.map(i=>({...i.toJSON(),attachments:attachments.filter(a=>a.item_id===i.id)})),events};
  }),
  update:run(async req=>{
    editor(req);
    return db.sequelize.transaction(async transaction=>{
      const project=await service.access(req.user,req.params.id,transaction),item=await service.itemFor(project,req.params.itemId,transaction);
      service.checkRevision(item,req.body.revision);
      const status=req.body.status;
      if(!['pending','submitted','changes','complete','na'].includes(status))service.fail(400,'Choose a valid checklist status.');
      if(typeof req.body.remarks!=='string'||req.body.remarks.length>5000)service.fail(400,'Remarks must be text up to 5000 characters.');
      const remarks=req.body.remarks.trim();
      if(['changes','na'].includes(status)&&!remarks)service.fail(400,'Explain the changes requested or why this requirement is not applicable.');
      if(status==='na'&&!item.conditional)service.fail(400,'This is a mandatory checklist requirement.');
      if(status==='submitted'&&item.requires_file&&!await db.MonitoringAttachment.count({where:{item_id:item.id},transaction}))service.fail(400,'No attachment has been submitted.');
      const submitted_on=status==='complete'&&!req.body.submitted_on?item.submitted_on||service.today():service.date(req.body.submitted_on),returned_on=service.date(req.body.returned_on);
      if(returned_on&&(!submitted_on||returned_on<submitted_on))service.fail(400,'Date returned must be on or after date submitted.');
      const before=item.toJSON();
      await item.update({status,remarks,submitted_on,returned_on,revision:item.revision+1},{transaction});
      await service.log(project.id,item.id,req.user,'checklist_updated',{before,after:item.toJSON()},transaction);
      return {message:'Checklist saved.'};
    });
  }),
  uploadGuard:async(req,res,next)=>{
    try{if(Number(req.user.role_id)!==2)service.fail(403,'Only the project researcher can submit files.');const project=await service.access(req.user,req.params.id);const item=await service.itemFor(project,req.params.itemId);if(!item.requires_file||item.status==='na')service.fail(403,'This requirement does not accept researcher attachments.');next();}catch(e){if(e.status)return res.status(e.status).json({message:e.message});next(e);}
  },
  upload:run(async req=>{
    const file=req.file;if(!file)service.fail(400,'Choose a file to upload.');
    const ext=path.extname(file.originalname).toLowerCase();
    const type=ext==='.pdf'&&file.buffer.subarray(0,5).toString()==='%PDF-'?'application/pdf':ext==='.png'&&file.buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':['.jpg','.jpeg'].includes(ext)&&file.buffer[0]===255&&file.buffer[1]===216&&file.buffer[2]===255?'image/jpeg':null;
    if(!type)service.fail(400,'Choose a valid PDF, PNG, or JPEG file.');
    const storageKey=randomUUID()+ext;let saved=false;
    try{return await db.sequelize.transaction(async transaction=>{
      const project=await service.access(req.user,req.params.id,transaction),item=await service.itemFor(project,req.params.itemId,transaction);
      if(!item.requires_file||item.status==='na')service.fail(403,'This requirement does not accept researcher attachments.');
      service.checkRevision(item,req.body.revision);
      await fs.mkdir(uploadRoot,{recursive:true});await fs.writeFile(path.join(uploadRoot,storageKey),file.buffer,{flag:'wx'});saved=true;
      const attachment=await db.MonitoringAttachment.create({item_id:item.id,filename:path.basename(file.originalname).replace(/[\x00-\x1f\x7f]/g,'').slice(0,240)||'attachment'+ext,storage_key:storageKey,content_type:type,byte_size:file.size,created_by:req.user.id},{transaction});
      await item.update({status:'submitted',submitted_on:service.today(),returned_on:null,revision:item.revision+1},{transaction});
      await service.log(project.id,item.id,req.user,'file_submitted',{attachment_id:attachment.id,filename:attachment.filename},transaction);
      return {message:'File submitted for CRD review.'};
    });}catch(e){if(saved)await fs.unlink(path.join(uploadRoot,storageKey)).catch(()=>{});throw e;}
  }),
  download:async(req,res,next)=>{
    try{const project=await service.access(req.user,req.params.id);const attachment=await db.MonitoringAttachment.findByPk(req.params.fileId);if(!attachment)service.fail(404,'Attachment not found.');await service.itemFor(project,attachment.item_id);if(!/^[a-f0-9-]+\.(pdf|png|jpe?g)$/.test(attachment.storage_key))service.fail(404,'Attachment not found.');res.set('Cache-Control','private, no-store');res.set('Content-Type',attachment.content_type);res.download(path.join(uploadRoot,attachment.storage_key),attachment.filename,error=>{if(error&&!res.headersSent)res.status(error.code==='ENOENT'?404:500).json({message:'The attachment is unavailable.'});});}catch(e){if(e.status)return res.status(e.status).json({message:e.message});next(e);}
  }
};
module.exports=c;
