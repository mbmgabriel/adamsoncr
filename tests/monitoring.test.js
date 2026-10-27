const test=require('node:test');
const assert=require('node:assert/strict');
const {checklist,progress}=require('../app/services/monitoring/checklist');
test('F-CRD-003 includes each tranche, extension, and clearance requirement once',()=>{
  assert.equal(checklist.length,25);assert.equal(new Set(checklist.map(i=>i.key)).size,25);
  for(const prefix of ['fund_','liquidation_'])assert.equal(checklist.filter(i=>i.key.startsWith(prefix)).length,3);
  assert.equal(checklist.filter(i=>i.key.startsWith('extension_')).length,2);
  assert.equal(checklist.filter(i=>i.section==='clearance').length,7);
});
test('only completed applicable requirements contribute to shared progress',()=>{
  assert.deepEqual(progress([{status:'complete'},{status:'submitted'},{status:'changes'},{status:'na'}]),{completed:1,applicable:3,excluded:1,submitted:1,changes:1,percent:33,finished:false});
  assert.equal(progress([{status:'complete'},{status:'na'}]).finished,true);
  assert.equal(progress([{status:'na'}]).percent,0);assert.equal(progress([]).finished,false);
});
