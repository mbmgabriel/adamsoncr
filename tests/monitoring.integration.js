// Local-only fixtures; never connects to a hosted API or database.
require('dotenv').config();
const assert=require('node:assert/strict');
const fs=require('fs/promises');
const path=require('path');
if(process.env.DB_DATABASE!=='adamsoncr_local'||!['127.0.0.1','localhost'].includes(process.env.DB_HOST))throw Error('Monitoring integration requires adamsoncr_local on localhost.');
const db=require('../app/models');
const Token=require('../app/services/token/token_service');
const app=require('../app');
const {enroll}=require('../app/services/monitoring/service');
let server,base,project,research,other,checks=0;
const fileRoot=path.resolve(__dirname,'../private_uploads/monitoring');
async function request(account,url,method='GET',body,expected=200){
 const response=await fetch(base+url,{method,headers:{...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...(account?{Authorization:`Bearer ${Token.generateToken(account.id)}`}:{})},...(body?{body:body instanceof FormData?body:JSON.stringify(body)}:{})});
 const json=await response.json();assert.equal(response.status,expected,`${method} ${url}: ${JSON.stringify(json)}`);checks++;return json;
}
async function main(){
 db.sequelize.options.logging=false;await db.sequelize.authenticate();
 server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});base=`http://127.0.0.1:${server.address().port}/api/v1`;
 const accounts={};for(const key of ['local_researcher','local_crd_staff','local_crd_director','local_admin','local_urb_1']){accounts[key]=await db.UserAccount.findOne({where:{username:key}});assert(accounts[key],`Missing local fixture ${key}`);}
 const owner=accounts.local_researcher,staff=accounts.local_crd_staff,director=accounts.local_crd_director;
 const profile=await db.User.findOne({where:{user_account_id:owner.id}});
 research=await db.Research.create({title:'MONITORING INTEGRATION - temporary',status_id:2,created_by:profile.id,research_duration:'12 months'});
 await db.sequelize.transaction(async transaction=>{const locked=await db.Research.findByPk(research.id,{transaction,lock:transaction.LOCK.UPDATE});project=await enroll(locked,transaction,owner);assert.equal((await enroll(locked,transaction,owner)).id,project.id);});
 const route=`/monitoring/${project.id}`;
 await request(null,route,'GET',null,401);await request(accounts.local_admin,route,'GET',null,403);await request(accounts.local_urb_1,route,'GET',null,403);
 other=await db.UserAccount.create({username:`monitor_other_${Date.now()}`,password:'not-a-login-fixture',role_id:2,active:true});
 await request(other,route,'GET',null,403);
 let detail=await request(owner,route);assert.equal(detail.items.length,25);assert.equal(detail.progress.percent,0);
 const item=detail.items.find(i=>i.key==='draft'),record=detail.items.find(i=>i.key==='fund_1');
 const update={status:'complete',remarks:'Verified',submitted_on:'2026-10-27',returned_on:'',revision:item.revision};
 await request(owner,`${route}/items/${item.id}`,'PUT',update,403);
 await request(staff,`${route}/items/${item.id}`,'PUT',{...update,submitted_on:'2026-02-30'},400);
 await request(staff,`${route}/items/${item.id}`,'PUT',{...update,returned_on:'2026-10-26'},400);
 const upload=(fileName,contents,revision)=>{const data=new FormData();data.append('revision',revision);data.append('file',new Blob([contents],{type:'application/pdf'}),fileName);return data;};
 await request(other,`${route}/items/${item.id}/files`,'POST',upload('test.pdf','%PDF-1.4\nfixture',0),403);
 await request(staff,`${route}/items/${item.id}/files`,'POST',upload('test.pdf','%PDF-1.4\nfixture',0),403);
 await request(owner,`${route}/items/${record.id}/files`,'POST',upload('test.pdf','%PDF-1.4\nfixture',0),403);
 await request(owner,`${route}/items/${item.id}/files`,'POST',upload('fake.pdf','not a PDF',0),400);
 await request(owner,`${route}/items/${item.id}/files`,'POST',upload('oversize.pdf',new Uint8Array(20*1024*1024+1),0),413);
 await request(owner,`${route}/items/${item.id}/files`,'POST',upload('draft.pdf','%PDF-1.4\nfixture',0));
 detail=await request(director,route);let current=detail.items.find(i=>i.id===item.id);assert.equal(current.status,'submitted');assert.equal(detail.progress.percent,0);assert.equal(current.attachments.length,1);
 await request(staff,`${route}/items/${item.id}`,'PUT',update,409);
 await request(staff,`${route}/items/${item.id}`,'PUT',{...update,revision:current.revision});
 detail=await request(owner,route);assert.equal(detail.progress.percent,4);
 current=detail.items.find(i=>i.id===item.id);
 await request(director,`${route}/items/${item.id}`,'PUT',{...update,status:'na',revision:current.revision},400);
 await request(director,`${route}/items/${item.id}`,'PUT',{...update,status:'changes',remarks:'',revision:current.revision},400);
 await request(director,`${route}/items/${item.id}`,'PUT',{...update,status:'changes',remarks:'Please revise the abstract.',returned_on:'2026-10-27',revision:current.revision});
 detail=await request(owner,route);assert.equal(detail.progress.percent,0);current=detail.items.find(i=>i.id===item.id);
 await request(owner,`${route}/items/${item.id}/files`,'POST',upload('draft-v2.pdf','%PDF-1.4\nfixture version 2',current.revision));
 detail=await request(owner,route);current=detail.items.find(i=>i.id===item.id);assert.equal(current.attachments.length,2);assert.equal(current.attachments[0].filename,'draft-v2.pdf');assert.equal(current.returned_on,null);
 const attachment=current.attachments[0];assert(!Object.hasOwn(attachment,'storage_key'));
 const download=await fetch(base+`${route}/files/${attachment.id}`,{headers:{Authorization:`Bearer ${Token.generateToken(owner.id)}`}});assert.equal(download.status,200);assert.equal(await download.text(),'%PDF-1.4\nfixture version 2');assert.equal(download.headers.get('cache-control'),'private, no-store');checks++;
 await request(other,`${route}/files/${attachment.id}`,'GET',null,403);
 const optional=detail.items.find(i=>i.key==='patent');
 await request(director,`${route}/items/${optional.id}`,'PUT',{...update,status:'na',remarks:'Not applicable to this project.',submitted_on:'',revision:optional.revision});
 detail=await request(owner,route);assert.equal(detail.progress.applicable,24);assert.equal(detail.progress.excluded,1);assert(detail.events.some(e=>e.action==='file_submitted'));assert(detail.events.some(e=>e.action==='checklist_updated'));
 const summary=await request(owner,'/monitoring');assert(summary.projects.some(p=>p.id===project.id));await request(staff,'/monitoring');assert.equal(await db.MonitoringProject.count({where:{research_id:research.id}}),1);
 // Completion-gated exports and researcher-owned clearance persist independently of office signatures.
 await request(owner,`${route}/export`,'GET',null,409);
 await request(owner,`${route}/clearance`,'GET',null,409);
 await db.MonitoringItem.update({status:'complete'},{where:{project_id:project.id}});
 const exported=await request(owner,`${route}/export`);assert.equal(exported.items.length,25);assert.equal(exported.progress.finished,true);
 await request(other,`${route}/export`,'GET',null,403);
 await request(accounts.local_admin,`${route}/clearance`,'GET',null,403);
 let clearance=await request(owner,`${route}/clearance`);assert.equal(clearance.clearance.saved,false);
 await request(owner,`${route}/clearance/export`,'GET',null,409);
 const form={...clearance.clearance.form,date_completed:'2026-10-27',college_department:'Science / Biology',faculty_researchers:['Local Researcher',''],revision:0};
 await request(staff,`${route}/clearance`,'PUT',form,403);
 await request(other,`${route}/clearance`,'PUT',form,403);
 await request(owner,`${route}/clearance`,'PUT',{...form,date_completed:'2026-02-30'},400);
 await request(owner,`${route}/clearance`,'PUT',{...form,faculty_researchers:['','']},400);
 await request(owner,`${route}/clearance`,'PUT',{...form,office_signature:'forged'},400);
 clearance=await request(owner,`${route}/clearance`,'PUT',form);assert.equal(clearance.clearance.revision,1);
 await request(owner,`${route}/clearance`,'PUT',form,409);
 const saved=await request(director,`${route}/clearance/export`);assert.equal(saved.clearance.form.faculty_researchers[0],'Local Researcher');assert.equal(saved.clearance.form.date_completed,'2026-10-27');
 await request(other,`${route}/clearance/export`,'GET',null,403);
 const reopened=await db.MonitoringItem.findByPk(item.id);
 await request(staff,`${route}/items/${item.id}`,'PUT',{...update,status:'pending',revision:reopened.revision});
 await request(owner,`${route}/export`,'GET',null,409);
 await request(owner,`${route}/clearance/export`,'GET',null,409);
 await request(owner,`${route}/clearance`,'PUT',{...form,revision:1},409);
 assert.equal(await db.MonitoringClearance.count({where:{project_id:project.id}}),1);
 const history=await request(owner,route);assert(history.events.some(e=>e.action==='clearance_saved'));
 console.log(`PASS: monitoring integration (${checks} HTTP checks): role and ownership restrictions, enrollment idempotency, checklist dates, concurrency, private downloads, file signatures and versions, review progress, applicability, history, and persisted list.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
 try{if(project){const items=await db.MonitoringItem.findAll({where:{project_id:project.id}});const ids=items.map(i=>i.id);const files=ids.length?await db.MonitoringAttachment.findAll({where:{item_id:ids}}):[];for(const file of files)await fs.unlink(path.join(fileRoot,file.storage_key)).catch(()=>{});if(ids.length)await db.MonitoringAttachment.destroy({where:{item_id:ids},force:true});await db.MonitoringClearance.destroy({where:{project_id:project.id},force:true});await db.MonitoringEvent.destroy({where:{project_id:project.id},force:true});await db.MonitoringItem.destroy({where:{project_id:project.id},force:true});await project.destroy({force:true});}if(research)await research.destroy({force:true});if(other)await other.destroy({force:true});}catch(e){console.error('Fixture cleanup failed:',e.message);process.exitCode=1;}
 if(server)await new Promise(resolve=>server.close(resolve));await db.sequelize.close();
});
