const db=require('../../app/models');
const fs=require('fs/promises');
const path=require('path');
module.exports=async researchId=>{
  if(process.env.DB_DATABASE!=='adamsoncr_local'||!['localhost','127.0.0.1'].includes(process.env.DB_HOST))throw Error('Local fixture cleanup only.');
  const projects=await db.MonitoringProject.findAll({where:{research_id:researchId},paranoid:false});
  for(const project of projects){
    const items=await db.MonitoringItem.findAll({where:{project_id:project.id},paranoid:false});
    const ids=items.map(i=>i.id);
    if(ids.length){
      const files=await db.MonitoringAttachment.findAll({where:{item_id:ids},paranoid:false});
      for(const file of files)if(/^[a-f0-9-]+\.(pdf|png|jpe?g)$/.test(file.storage_key))await fs.unlink(path.resolve(__dirname,'../../private_uploads/monitoring',file.storage_key)).catch(()=>{});
      await db.MonitoringAttachment.destroy({where:{item_id:ids},force:true});
    }
    await db.MonitoringClearance.destroy({where:{project_id:project.id},force:true});await db.MonitoringEvent.destroy({where:{project_id:project.id},force:true});
    await db.MonitoringItem.destroy({where:{project_id:project.id},force:true});
    await project.destroy({force:true});
  }
};
