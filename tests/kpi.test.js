import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculate } from '../src/modules/kpi.js';
import { validateSnapshot } from '../src/data/model.js';
const sample = JSON.parse(await readFile(new URL('../data/sample.json',import.meta.url)));
test('weighted rates use summed denominators',()=>{
 const rows = structuredClone(sample.daily);
 rows[0].orders=1; rows[0].sessions=10; rows[1].orders=9; rows[1].sessions=90;
 assert.equal(calculate(rows).cr,0.1);
 assert.equal(calculate(rows).aov,(rows[0].gmv+rows[1].gmv)/10);
});
test('zero denominators are unavailable',()=>{
 const result=calculate([]); for(const key of ['cr','aov','roas','ctr','cpc','affiliateAov']) assert.equal(result[key],null);
});
test('schema rejects duplicates, missing fields, negatives and invalid dates',()=>{
 assert.equal(validateSnapshot(sample),sample);
 for (const mutate of [d=>d.daily.push(d.daily[0]),d=>delete d.daily[0].gmv,d=>d.daily[0].sessions=-1,d=>d.daily[0].date='2026-02-30']) {
 const copy=structuredClone(sample); mutate(copy); assert.throws(()=>validateSnapshot(copy));
 }
});
