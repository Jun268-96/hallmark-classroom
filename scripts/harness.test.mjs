import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {checkSource,validateContract,outcome,verify,hash} from './verify_lesson.mjs';

const doc=script=>`<!doctype html><html lang="ko"><head><title>검사</title><meta name="viewport" content="width=device-width"></head><body><script>${script}</script></body></html>`;
test('Syntax check compiles but does not execute lesson JavaScript',()=>{
  assert(checkSource(doc('throw new Error("must not execute")')).every(x=>x.ok));
  assert(checkSource(doc('const = ;')).some(x=>!x.ok));
});
test('Missing browser, partial runs, and failed paths never pass',()=>{
  const r={source:[{ok:true}],cases:[{ok:true}],layouts:[{ok:true}],runtimeErrors:[],browser:'ran'};
  assert.equal(outcome(r),'passed');assert.equal(outcome({...r,browser:'not-run'}),'incomplete');
  assert.equal(outcome({...r,cases:[] }),'incomplete');assert.equal(outcome({...r,runtimeErrors:['error']}),'failed');
  assert.equal(outcome({...r,cases:[{ok:false}]}),'failed');
});
test('Empty and unsupported behavior contracts are rejected',()=>{
  assert.throws(()=>validateContract({version:1,cases:[],scenes:[]}));
  assert.throws(()=>validateContract({version:1,cases:[{name:'bad',steps:[{action:'execute',selector:'body'}],expect:[{selector:'body',text:'x'}]}],scenes:[{name:'main',steps:[]}]}));
});
test('Static-only report binds evidence to actual HTML and remains incomplete',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'hallmark-test-'));
  try {const text=doc('let n=1;'),file=path.join(dir,'lesson.html');await fs.writeFile(file,text);
    const {report}=await verify(file,{out:path.join(dir,'report'),staticOnly:true});
    assert.equal(report.sourceSha256,hash(text));assert.equal(report.status,'incomplete');assert.equal(report.browser,'not-run');
  }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('Unavailable browser module records incomplete rather than success',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'hallmark-unavailable-'));
  try {
    const file=path.join(dir,'lesson.html'),contract=path.join(dir,'checks.json');await fs.writeFile(file,doc('let n=1;'));
    await fs.writeFile(contract,JSON.stringify({version:1,scenes:[{name:'main',steps:[]}],cases:[{name:'title',steps:[],expect:[{selector:'body',includes:['검사']}]}]}));
    const {report}=await verify(file,{contract,out:path.join(dir,'report'),playwright:'hallmark-deliberately-unavailable-module'});
    assert.equal(report.status,'incomplete');assert.equal(report.cases.length,0);assert(report.notes.length);
  }finally{await fs.rm(dir,{recursive:true,force:true});}
});
