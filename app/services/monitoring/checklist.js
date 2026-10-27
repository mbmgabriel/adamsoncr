// F-CRD-003 (09-01-23). Grouped entries are tracked individually.
const definitions = [
  ['signed_proposal','proposal','Submission of the duly signed Research Proposal Application Form',true,false],
  ['itso','proposal','CRD review and endorsement to ITSO for prior patent search',false,true],
  ['ethics_endorsement','proposal','CRD endorsement to UERC/IACUC',false,true],
  ['external_review','proposal','Reviewed by external evaluator',false,true],
  ['endorsed_revision','proposal','Revision of the endorsed proposal by the researcher',true,true],
  ['urb_critique','proposal','Critiquing with the URB of the submitted research proposal',false,true],
  ['proposal_revision','proposal','Revision of the proposal',true,true],
  ['mru','proposal','Signing of Memorandum of Research Undertaking (MRU) and other documents',true,false],
  ...[1,2,3].map(n=>[`fund_${n}`,'implementation',`Fund release · Tranche ${n}`,false,true]),
  ['conduct','implementation','Actual conduct of research',false,false],
  ['consultation','implementation','Regular consultation, coordination and monitoring of research',false,false],
  ...[1,2].map(n=>[`extension_${n}`,'implementation',`Official research extension form · Extension ${n}`,true,true]),
  ...[1,2,3].map(n=>[`liquidation_${n}`,'implementation',`Liquidation of the operational budget · Tranche ${n}`,true,true]),
  ['draft','clearance','Review of the submitted draft manuscript',true,false],
  ['final_manuscript','clearance','Final submission of the completed and approved manuscript',true,true],
  ['copyright','clearance','CRD research clearance · Copyright',true,false],
  ['patent','clearance','CRD research clearance · Patent',true,true],
  ['utility_model','clearance','CRD research clearance · Utility model',true,true],
  ['ethics_certificate','clearance','CRD research clearance · UERC/IACUC certification',true,true],
  ['library','clearance','CRD research clearance · Library requirements',true,false],
];
const checklist = definitions.map(([key,section,label,requires_file,conditional],position)=>({key,section,label,requires_file,conditional,position}));
function progress(items) {
  const applicable=items.filter(row=>row.status!=='na');
  const completed=applicable.filter(row=>row.status==='complete').length;
  return { completed, applicable:applicable.length, excluded:items.length-applicable.length,
    submitted:items.filter(row=>row.status==='submitted').length,
    changes:items.filter(row=>row.status==='changes').length,
    percent:applicable.length?Math.round(completed/applicable.length*100):0,
    finished:applicable.length>0&&completed===applicable.length };
}
module.exports={checklist,progress};
