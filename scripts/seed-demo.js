// Repeatable, additive sample data for the local development database only.
require('dotenv').config();
const assert=require('node:assert/strict');
const bcrypt=require('bcrypt');
const db=require('../app/models');
const monitoring=require('../app/services/monitoring/service');
const prefix='DEMO - ';
const people=[
  {username:'demo_anna',first:'Anna',last:'Reyes',topic:'Community Health and Urban Gardens',complete:8},
  {username:'demo_carlo',first:'Carlo',last:'Santos',topic:'Flood Resilience and Smart Drainage',complete:16},
  {username:'demo_mia',first:'Mia',last:'Cruz',topic:'Digital Learning and Student Engagement',complete:4},
];
async function seed(){
  assert(['127.0.0.1','localhost'].includes(process.env.DB_HOST)&&process.env.DB_DATABASE==='adamsoncr_local'&&process.env.NODE_ENV!=='production','Demo data is restricted to localhost / adamsoncr_local.');
  db.sequelize.options.logging=false;
  const hash=await bcrypt.hash('password',10),manifest=[];
  await db.sequelize.transaction(async transaction=>{
    const opts={transaction};
    const reviewers={};
    for(const [role,username] of [[3,'local_rc'],[4,'local_chair'],[5,'local_dean'],[6,'local_crd_staff'],[7,'local_crd_director'],[8,'local_urb_1'],[9,'local_urb_2']]){
      const account=await db.UserAccount.findOne({where:{username},...opts});assert(account,`Run seed-local first: ${username}`);
      const profile=await db.User.findOne({where:{user_account_id:account.id},...opts});assert(profile);reviewers[role]={account,profile};
    }
    const depts=await db.Departments.findAll({where:{active:true},order:[['id','ASC']],...opts});assert(depts.length);
    const distinct=depts.filter((dept,index,array)=>array.findIndex(d=>d.college_id===dept.college_id)===index);
    const category=await db.ResearchCategory.findOne(opts),purpose=await db.ResearchPurpose.findOne(opts),fund=await db.BudgetBreakdownDetails.findOne(opts);
    const incentiveType=await db.SIncentiveTypes.findOne(opts),proof=await db.SPeerReviewProof.findOne(opts);
    assert(category&&purpose&&incentiveType&&proof,'Local reference rows are missing. Run seed-local first.');
    for(const [index,person] of people.entries()){
      let account=await db.UserAccount.findOne({where:{username:person.username},...opts});
      if(!account){
        // Preserve legacy form paths that expect profile and account IDs to match.
        const id=Math.max(Number(await db.UserAccount.max('id',{paranoid:false,...opts}))||0,Number(await db.User.max('id',{paranoid:false,...opts}))||0)+1;
        account=await db.UserAccount.create({id,username:person.username,password:hash,role_id:2,email:`${person.username}@example.test`,verified_at:new Date(),active:true,created_by:reviewers[7].account.id},opts);
      }
      assert.equal(account.role_id,2,'Reserved demo username has a different role.');
      let profile=await db.User.findOne({where:{user_account_id:account.id},...opts});
      if(!profile){assert(!await db.User.findByPk(account.id,opts),'Profile ID collision.');profile=await db.User.create({id:account.id,user_account_id:account.id,first_name:person.first,last_name:person.last,dept_id:(distinct[index]||depts[index%depts.length]).id,created_by:reviewers[7].account.id},opts);}
      const department=await db.Departments.findByPk(profile.dept_id,opts);
      const entry={username:person.username,name:`${person.first} ${person.last}`,department:department.dept_name,research:[],monitoring:[],assistance:[],incentive:[]};
      for(const state of ['Awaiting approval','Monitoring in progress','Monitoring completed']){
        const title=`${prefix}${person.topic} (${state})`;
        let research=await db.Research.findOne({where:{title,created_by:profile.id},...opts});
        if(!research){
          const approved=state!=='Awaiting approval';
          research=await db.Research.create({title,category:String(category.id),purpose_id:purpose.id,version_number:'1',research_duration:'2',ethical_considerations:0,submitted_by:entry.name,submitted_date:'2026-10-01T08:00:00Z',status_id:approved?2:1,created_by:profile.id},opts);
          await db.ResearchInvestigators.create({research_id:research.id,id_number:`DEMO-${account.id}`,first_name:person.first,last_name:person.last,email:account.email,college:department.dept_desc,dept:department.dept_name,created_by:profile.id},opts);
          if(fund)await db.BudgetBreakdowns.create({research_id:research.id,fund_id:fund.id,amount:15000+index*5000,created_by:profile.id},opts);
          await db.Endorsements.bulkCreate(Object.entries(reviewers).filter(([role])=>approved||Number(role)<8).map(([role,reviewer])=>({research_id:research.id,form_type_id:1,endorsement_rep_id:reviewer.profile.id,status_id:approved||Number(role)<[3,5,6][index]?6:4,remarks:approved?'DEMO fixture: approval completed for local testing.':null,created_by:profile.id})),opts);
          if(approved){
            const locked=await db.Research.findByPk(research.id,{...opts,lock:transaction.LOCK.UPDATE});
            const project=await monitoring.enroll(locked,transaction,reviewers[7].account);
            const items=await db.MonitoringItem.findAll({where:{project_id:project.id},order:[['position','ASC']],...opts});
            for(const [position,item] of items.entries()){
              const completed=state==='Monitoring completed'||position<person.complete;
              await item.update({status:completed?'complete':'pending',submitted_on:completed?'2026-10-05':null,returned_on:completed?'2026-10-20':null,remarks:completed?'DEMO: Verified by CRD for local testing; supporting documents treated as collected offline.':null,revision:1},opts);
            }
            await monitoring.log(project.id,null,reviewers[6].account,'checklist_updated',{demo_fixture:true,completed:state==='Monitoring completed'?25:person.complete,total:25},transaction);
          }
        }
        entry.research.push({id:research.id,title,status_id:research.status_id});
        const project=await db.MonitoringProject.findOne({where:{research_id:research.id},...opts});
        if(project){const items=await db.MonitoringItem.findAll({where:{project_id:project.id},...opts});entry.monitoring.push({id:project.id,research_id:research.id,progress:monitoring.progress(items),url:`http://localhost:3002/project-monitoring/${project.id}`});}
      }
      for(const approved of [false,true]){
        const status=approved?'Approved':'Pending';
        const assistanceTitle=`${prefix}${person.topic} (Assistance ${status})`;
        let assistance=await db.RequestAssistanceForms.findOne({where:{created_by:account.id,research_paper_title:assistanceTitle},...opts});
        if(!assistance){
          assistance=await db.RequestAssistanceForms.create({name_of_presenter:entry.name,email_address:account.email,contact_number:'',conference_title:`DEMO Research Conference ${index+1}`,research_paper_title:assistanceTitle,conference_link:'https://example.test/demo-conference',acceptance_date:'2026-10-01',conference_date:'2026-11-15',created_by:account.id,status_id:approved?10:1,approved_amount:approved?7500+index*2500:null},opts);
          await db.Endorsements.create({research_id:assistance.id,form_type_id:2,endorsement_rep_id:reviewers[7].profile.id,status_id:approved?10:4,remarks:approved?'DEMO: Approved presentation support.':null,created_by:account.id},opts);
        }
        entry.assistance.push({id:assistance.id,title:assistanceTitle,status_id:assistance.status_id});
        const incentiveTitle=`${prefix}${person.topic} (Incentive ${status})`;
        let incentive=await db.IncentiveForms.findOne({where:{created_by:account.id,title_of_work:incentiveTitle},...opts});
        if(!incentive){
          incentive=await db.IncentiveForms.create({name_of_authors:entry.name,email_address:account.email,contact_number:'',incentive_type_id:incentiveType.id,submission_date:'2026-10-15',publisher_info:'DEMO University Research Journal',title_of_work:incentiveTitle,publication_date:'2026-09-15',citation_date:'2026-10-10',citation_no:index+1,peer_review_proof_id:proof.id,created_by:account.id,status_id:approved?10:1,approved_amount:approved?10000+index*5000:null},opts);
          await db.Endorsements.create({research_id:incentive.id,form_type_id:3,endorsement_rep_id:reviewers[7].profile.id,status_id:approved?10:4,remarks:approved?'DEMO: Approved publication incentive.':null,created_by:account.id},opts);
        }
        entry.incentive.push({id:incentive.id,title:incentiveTitle,status_id:incentive.status_id});
      }
      manifest.push(entry);
    }
  });
  console.log(JSON.stringify({database:'adamsoncr_local',note:'Synthetic local fixtures only. Existing records and demo edits are preserved on rerun.',researchers:manifest},null,2));
}
seed().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>db.sequelize.close());
