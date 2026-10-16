import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export const hash = text => createHash('sha256').update(text).digest('hex');

export function checkSource(html) {
  const results = [];
  const check = (name, ok, detail) => results.push({name, ok, detail});
  check('html-document', /<!doctype html>/i.test(html) && /<html\b/i.test(html), '완성 HTML 문서');
  check('title', /<title>[^<]+<\/title>/i.test(html), '문서 제목');
  check('language', /<html[^>]+lang\s*=\s*["'][^"']+["']/i.test(html), '문서 언어');
  check('viewport', /<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(html), '모바일 viewport');
  let count = 0;
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = script[1], source = script[2];
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    if (/\bsrc\s*=/i.test(attrs) || (type && !['module', 'text/javascript', 'application/javascript'].includes(type))) continue;
    count++;
    const parsed = spawnSync(process.execPath, ['--check', `--input-type=${type === 'module' ? 'module' : 'commonjs'}`], {input: source, encoding:'utf8', timeout:5000});
    check(`script-syntax-${count}`, parsed.status === 0, parsed.status === 0 ? '문법 확인' : String(parsed.stderr || parsed.error).slice(0,1500));
  }
  check('inline-script', count > 0, '단일 HTML의 실행 코드');
  return results;
}

export function validateContract(contract) {
  if (contract.version !== 1 || !Array.isArray(contract.cases) || !contract.cases.length || !Array.isArray(contract.scenes) || !contract.scenes.length) throw Error('Contract requires version:1 and nonempty cases/scenes.');
  const validateSteps = steps => {
    if (!Array.isArray(steps)) throw Error('steps must be an array');
    for (const step of steps) {
      if (!['click','fill','press'].includes(step.action) || typeof step.selector !== 'string' || !step.selector) throw Error('Unsupported action or missing selector');
      if (step.action !== 'click' && typeof step.value !== 'string') throw Error('fill/press requires a string value');
    }
  };
  for (const item of [...contract.cases, ...contract.scenes]) {
    if (typeof item.name !== 'string' || !item.name) throw Error('Each case/scene requires a name');
    validateSteps(item.steps);
  }
  for (const item of contract.cases) {
    if (!Array.isArray(item.expect) || !item.expect.length) throw Error('Each case requires assertions');
    for (const assertion of item.expect) {
      if (typeof assertion.selector !== 'string' || !assertion.selector) throw Error('Assertion requires selector');
      const keys = Object.keys(assertion).filter(key => key !== 'selector');
      if (!keys.length || keys.some(key => !['includes','excludes','text','value','attribute','style','widthRatio'].includes(key))) throw Error('Unknown or empty assertion');
      for (const key of ['includes','excludes']) if (key in assertion && (!Array.isArray(assertion[key]) || !assertion[key].length || assertion[key].some(v=>typeof v!=='string'))) throw Error(`${key} must be a nonempty string array`);
      for(const key of ['text','value']) if(key in assertion && typeof assertion[key]!=='string')throw Error(`${key} must be a string`);
      for(const key of ['attribute','style']) if(key in assertion && (!assertion[key] || Array.isArray(assertion[key]) || typeof assertion[key]!=='object' || !Object.keys(assertion[key]).length || Object.values(assertion[key]).some(v=>typeof v!=='string')))throw Error(`${key} must be a nonempty string map`);
      if (assertion.widthRatio && (!Number.isFinite(assertion.widthRatio.expected) || assertion.widthRatio.expected<=0 || typeof assertion.widthRatio.other !== 'string')) throw Error('Invalid widthRatio');
    }
  }
  return contract;
}

export function outcome(report) {
  if (report.source.some(check => !check.ok) || report.cases.some(check => !check.ok) || report.layouts.some(check => !check.ok) || report.runtimeErrors.length) return 'failed';
  return report.browser === 'ran' && report.cases.length && report.layouts.length ? 'passed' : 'incomplete';
}

async function runSteps(page, steps) {
  for (const step of steps) {
    const target = page.locator(step.selector);
    if (step.action === 'click') await target.click();
    if (step.action === 'fill') await target.fill(step.value);
    if (step.action === 'press') await target.press(step.value);
  }
}

async function assertPage(page, assertion) {
  const node = page.locator(assertion.selector);
  if (await node.count() !== 1 || !await node.isVisible()) throw Error(`${assertion.selector}: 기대한 보이는 요소 한 개가 없음`);
  const text = (await node.innerText()).replace(/\s+/g,' ').trim();
  for (const part of assertion.includes || []) if (!text.includes(part)) throw Error(`${assertion.selector}: '${part}' 없음; 실제 '${text}'`);
  for (const part of assertion.excludes || []) if (text.includes(part)) throw Error(`${assertion.selector}: 금지된 '${part}'; 실제 '${text}'`);
  if ('text' in assertion && text !== assertion.text) throw Error(`${assertion.selector}: '${text}' ≠ '${assertion.text}'`);
  if ('value' in assertion && await node.inputValue() !== assertion.value) throw Error(`${assertion.selector}: 입력값 불일치`);
  if (assertion.attribute) for (const [key,value] of Object.entries(assertion.attribute)) if (await node.getAttribute(key) !== value) throw Error(`${assertion.selector}: ${key} 불일치`);
  if (assertion.style) for (const [key,value] of Object.entries(assertion.style)) {
    const actual=await node.evaluate((element,property)=>getComputedStyle(element).getPropertyValue(property).trim(),key);
    if(actual!==value) throw Error(`${assertion.selector}: ${key} '${actual}' ≠ '${value}'`);
  }
  if (assertion.widthRatio) {
    const first = await node.boundingBox(), second = await page.locator(assertion.widthRatio.other).boundingBox();
    const ratio = first && second && first.width/second.width;
    if (!Number.isFinite(ratio) || Math.abs(ratio - assertion.widthRatio.expected) > (assertion.widthRatio.tolerance ?? .025)) throw Error(`${assertion.selector}: 그림 너비 비 ${ratio}, 기대 ${assertion.widthRatio.expected}`);
  }
}

export async function verify(file, options = {}) {
  const html = await fs.readFile(file, 'utf8');
  const out = options.out ? path.resolve(options.out) : await fs.mkdtemp(path.join(os.tmpdir(),'hallmark-check-'));
  await fs.mkdir(out,{recursive:true});
  const report = {version:1, artifact:path.resolve(file), sourceSha256:hash(html), source:checkSource(html), browser:'not-run', cases:[], layouts:[], runtimeErrors:[], blockedRequests:[], screenshots:[], visualReview:'required', notes:[]};
  const save = async () => {report.status = outcome(report); await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));return {report,out};};
  if (report.source.some(check=>!check.ok)) return save();
  if (options.staticOnly) {report.notes.push('소스 검사만 실행. 동작·화면은 미검증.');return save();}
  if (!options.contract) {report.notes.push('동작 검사 계약이 필요합니다. 소스 검사만으로 통과 처리하지 않습니다.');return save();}
  let contract;
  try {const raw=await fs.readFile(options.contract,'utf8');report.contractSha256=hash(raw);contract=validateContract(JSON.parse(raw));}
  catch(error) {report.source.push({name:'contract',ok:false,detail:error.message});return save();}
  let chromium;
  try {({chromium}=await import(options.playwright || process.env.HC_PLAYWRIGHT || 'playwright'));}
  catch {report.notes.push('Playwright가 없습니다. 스킬 폴더에서 npm ci 후 npx playwright install chromium을 사용할 수 있습니다. 임의로 설치하지는 않았습니다.');return save();}
  let browser, server, watchdog;
  try {
    browser = await chromium.launch({headless:true,...(process.env.HC_BROWSER_EXECUTABLE ? {executablePath:process.env.HC_BROWSER_EXECUTABLE} : {})});
    watchdog=setTimeout(()=>browser.close().catch(()=>{}),120000);
    server = http.createServer((req,res)=>{if(req.url!=='/lesson.html'){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html);});
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const origin=`http://127.0.0.1:${server.address().port}`, url=origin+'/lesson.html';
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
    // Standalone lesson verification: no user profile, keys, or external network.
    await context.route('**/*',route=>route.request().url().startsWith(origin+'/') ? route.continue() : (report.blockedRequests.push(route.request().url()),route.abort()));
    const page=await context.newPage();page.setDefaultTimeout(5000);
    page.on('pageerror',error=>report.runtimeErrors.push(error.message));
    report.browser='ran';
    for (const item of contract.cases) {
      try {await page.goto(url,{waitUntil:'load'});await runSteps(page,item.steps);for(const assertion of item.expect)await assertPage(page,assertion);report.cases.push({name:item.name,ok:true});}
      catch(error) {report.cases.push({name:item.name,ok:false,detail:error.message});}
    }
    for (const width of [1440,375,320]) for (let i=0;i<contract.scenes.length;i++) {
      const scene=contract.scenes[i],name=`${String(i+1).padStart(2,'0')}-${width}.png`;
      try {
        await page.setViewportSize({width,height:width===1440?1000:812});await page.goto(url,{waitUntil:'load'});await runSteps(page,scene.steps);
        const measure=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1, title:document.title, text:document.body.innerText.trim()}));
        if(measure.overflow || !measure.title || !measure.text) throw Error(measure.overflow?'가로 넘침':'빈 화면 또는 제목');
        await page.screenshot({path:path.join(out,name),fullPage:true});report.screenshots.push(name);report.layouts.push({name:scene.name,width,ok:true});
      } catch(error) {report.layouts.push({name:scene.name,width,ok:false,detail:error.message});}
    }
    if(report.blockedRequests.length)report.notes.push('외부 요청을 차단했습니다. 스크린샷에서 대체 글꼴·누락 자산을 확인하세요.');
  } catch(error) {report.notes.push(`브라우저 실행을 완료하지 못함: ${error.message}`);report.browser='unavailable';}
  finally {clearTimeout(watchdog);if(browser)await browser.close().catch(()=>{});if(server)await new Promise(resolve=>server.close(resolve));}
  return save();
}

if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const [file,...flags]=process.argv.slice(2);
  const options={};
  try {
    if(!file || file==='--help'){console.log('node scripts/verify_lesson.mjs lesson.html --contract cases.json [--out directory] [--static]');process.exit(file?0:2);}
    for(let i=0;i<flags.length;i++){
      if(flags[i]==='--static'){options.staticOnly=true;continue;}
      if(!['--contract','--out'].includes(flags[i]) || !flags[i+1])throw Error('Unknown or missing option');
      options[flags[i].slice(2)]=flags[++i];
    }
    const {report,out}=await verify(file,options);
    console.log(JSON.stringify({status:report.status,report:path.join(out,'report.json'),sourceSha256:report.sourceSha256,passedCases:report.cases.filter(x=>x.ok).length,failedCases:report.cases.filter(x=>!x.ok),failedLayouts:report.layouts.filter(x=>!x.ok),notes:report.notes,visualReview:report.visualReview},null,2));
    process.exitCode=report.status==='passed'?0:report.status==='failed'?1:2;
  }catch(error){console.error(error.message);process.exitCode=2;}
}
