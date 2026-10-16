# Hallmark Classroom · Harness Bundle

기존 스킬에 포함된 하네스입니다. 별도 서비스나 API 키를 만들지 않습니다. 아래 지침을 읽고 필요한 파일 블록을 임시 작업 폴더의 해당 상대 경로에 저장하세요. 기존 사용자 파일은 덮어쓰지 않습니다. 브라우저·Node 실행이 안 되면 실행했다고 주장하지 않습니다.

# Skill harness

이 하네스는 현재 AI가 스킬의 자산과 검사기를 사용하도록 묶은 패키지다. 별도 서비스·서버·모델 API 키가 필요하지 않다. 실행 주체는 지금 자료를 만드는 AI이며, 검사 명령 자체가 AI를 호출하거나 파일을 자동 수정하지는 않는다.

## 연결한 공개 절차

Superpowers의 `verification-before-completion`에서 검증 명령 선정 → 실행 → 전체 출력 읽기 → 근거로 완료 판단의 게이트를 가져왔다. 원문은 `third_party/superpowers/verification-before-completion.md`, MIT 라이선스는 같은 폴더의 `LICENSE`에 보존한다. 기준 커밋은 `bb92a77741419a4ab5f06e711a283343f1ada0c3`이다.

- 출처: https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3
- 전체 Superpowers 런타임·플러그인을 설치하거나 OpenHands를 실행하는 구성은 아니다. 실행·검증에 필요한 부분만 이 스킬의 반복 작업으로 연결했다.
- 검사 성공은 계산·동작의 명시된 항목에 한정한다. 디자인의 완성도는 스크린샷을 직접 보고 판단한다. 상위 모델과 같은 결과나 무료 웹 자동 실행을 보장하지 않는다.

## 기준 자산을 먼저 사용한다

- `assets/ratio-lesson.html`: 같은 비 → 비례식 → 비례배분 → 확인 문제의 단일 HTML. 6.1 Sol 제작 사례를 바탕으로 중복 표시와 외부 글꼴 의존을 정리한 기준 자료다.
- `assets/ratio-lesson.contract.json`: 위 자료의 실제 입력·버튼·출력을 검사하는 계약이다. 계산 결과뿐 아니라 그림의 너비 비, 오류 복구, 동치 분수 채점, 다시 풀기를 확인한다.
- `assets/ratio-legacy.contract.json`: 기존 색 막대 자료의 선택자를 사용한 회귀 검사 예. 해당 구조에서 소수 입력 제한, 표시한 반올림 답의 오답 처리, 틀린 등호를 찾는다. 임의의 HTML에 그대로 적용하면 선택자가 달라 실패할 수 있다.
- `scripts/verify_lesson.mjs`: 문법 검사, 계약의 실제 UI 조작, 데스크톱·모바일 스크린샷, JSON 보고서를 제공한다. AI·API를 호출하지 않는다.

새 비례식 자료는 기준 HTML을 작업 폴더에 복사해서 수업 맥락·예제·문구·시각 표현을 조정한다. 기존 자료의 디자인을 간소화할 때는 원본을 기준 자료로 바꾸지 않는다. 다른 과목에는 이 수학 예제를 강제하지 말고 해당 수업의 자산과 검사를 구성한다.

## 실행 환경에 따라 사용한다

**파일·터미널·브라우저가 있는 환경:** 스킬 폴더에서 한 번 의존성을 준비하고, 작업 HTML을 검사한다. 이미 사용 가능한 Playwright·Chromium이 있으면 재설치하지 않는다.

```sh
npm ci
npx playwright install chromium
node scripts/verify_lesson.mjs /path/to/lesson.html --contract assets/ratio-lesson.contract.json --out /path/to/check-1
```

**웹의 코드 실행 환경:** GitHub 원문을 여러 번 가져오기 어렵다면 저장소의 `HARNESS_BUNDLE.md`를 읽는다. 필요한 지침·기준 HTML·검사 코드·기본 계약·패키지 파일이 한 문서에 들어 있다. 코드 블록의 상대 파일명대로 임시 작업 폴더에 저장해서 쓴다. 스킬 설치나 별도 API 키를 요구하지 않는다. 코드 도구가 임의 패키지 설치·Node·브라우저를 지원하는지는 확인한다.

**브라우저 실행이 불가능한 환경:** 아래 소스 검사만 실행할 수 있다. 종료 코드 2와 `incomplete`가 정상이다. HTML·스크립트 문법 검사는 동작·화면 검증을 대체하지 않는다.

```sh
node scripts/verify_lesson.mjs /path/to/lesson.html --static --out /path/to/source-check
```

**코드 실행 도구도 없는 환경:** 기준 HTML과 검증 사례를 읽어 전체 HTML을 제공하되 실행하지 못한 검사를 알린다. 하네스가 돌아간 것처럼 보고하지 않는다.

## AI가 수행할 수정 루프

1. 요청 범위와 기준 자산·원본을 읽고 자료를 만든다. 복잡한 작업은 수행할 변경·검사 항목을 짧게 정한다.
2. 자료의 구조에 맞는 계약으로 검사 명령을 실행한다. 반환된 종료 코드와 `report.json`의 실패 이유를 읽는다.
3. **실패한 실제 동작을 수정**한다. 오류를 숨기기 위해 기대값을 틀리게 바꾸거나 검사 항목을 지우지 않는다. UI 구조를 합리적으로 바꿨다면 같은 동작을 검증하도록 선택자를 갱신하고 그 변경을 기록한다.
4. 같은 실패 입력을 포함해 다시 검사한다. 기본값만 통과시켜 끝내지 않는다. 첫 검사 뒤 수정 재검사는 최대 2회로 제한한다. 계속 실패하면 완성으로 주장하지 말고 남은 항목과 파일을 전달한다.
5. 보고서의 스크린샷을 직접 열어 큰 조작 화면, 짧은 제목·문구, 불필요한 반복, 잘림과 입력 가독성을 확인한다. 가로 넘침이 없다는 사실만으로 디자인이 좋다고 결론내리지 않는다.
6. 최종 HTML의 SHA-256이 보고서의 `sourceSha256`과 같은지 확인하고 결과를 전달한다. 검사 후 수정했다면 다시 검사해야 한다.

## 결과를 판정하는 규칙

| 결과 | 종료 코드 | 의미 |
| --- | --- | --- |
| `passed` | 0 | 소스·실제 UI 검사·세 화면 너비의 명시된 항목을 실행해 통과. 미적 품질·모든 입력의 정답·접근성 인증을 뜻하지 않음 |
| `failed` | 1 | 코드·계약·동작·레이아웃·실행 중 오류 발견. 보고서의 실패 항목을 수정 |
| `incomplete` | 2 | 브라우저·계약 부족 또는 소스 검사만 수행. 실행을 못한 항목을 밝혀 전달 |

보고서는 대상·계약의 해시, 실제 실행한 검사, 오류, 스크린샷 경로를 기록한다. 보고서의 `visualReview: required`는 AI가 이미지를 읽어 시각 검토해야 한다는 뜻이며 자동으로 디자인 승인된 상태가 아니다.

## 다른 자료에 맞는 검사 계약

계약은 임의 코드를 실행하지 않는 JSON이다. 실제 HTML의 선택자로 입력·클릭·키 입력을 지정하고, 학생 화면의 결과를 확인한다. 구현의 계산 함수를 직접 호출하거나 성공 여부를 앱의 자기보고 값만으로 판정하지 않는다.

```json
{
  "version": 1,
  "scenes": [{"name": "비례배분", "steps": [{"action": "click", "selector": "[data-step=\"2\"]"}]}],
  "cases": [{
    "name": "전체가 80이면 두 몫은 32와 48",
    "steps": [
      {"action": "click", "selector": "[data-step=\"2\"]"},
      {"action": "fill", "selector": "#total", "value": "80"},
      {"action": "fill", "selector": "#part-a", "value": "2"},
      {"action": "fill", "selector": "#part-b", "value": "3"}
    ],
    "expect": [{"selector": ".ribbon", "includes": ["32 cm", "48 cm"]}]
  }]
}
```

`steps`는 `click`, `fill`, `press`를 지원한다. `expect`는 `text`, `includes`, `excludes`, `value`, `attribute`, `style`, `widthRatio`를 지원한다. `style`은 실제 계산된 CSS 속성을 비교하고 `widthRatio`는 `other` 선택자와 실제 요소 너비의 비를 비교한다. 빈 계약이나 알 수 없는 동작은 통과시키지 않는다.

브라우저 검사는 새 임시 프로필과 루프백 주소의 단일 HTML로 실행하며 외부 네트워크 요청은 차단한다. 기존 프로젝트의 CDN·여러 파일·서버 흐름은 이 단일 HTML 검사기의 범위 밖이다. 그 경우 기존 실행 환경에서 동등한 검사를 하고 사용한 방법을 알린다.


## File: assets/ratio-lesson.html

~~~~html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f6f4ec"><meta name="description" content="주스의 비를 비교하고, 비례식의 성질을 발견하고, 리본을 비례배분하는 초등 수학 실험실.">
  <title>비례 실험실 · 비례식과 비례배분</title>
  <style>:root{--paper:#f6f4ec;--ink:#172d33;--muted:#52666a;--line:#d8ddd5;--orange:#eb7136;--orange-pale:#fbe1cd;--teal:#1d7476;--teal-pale:#d9ebdf;--white:#fffef9;--red:#a83d2b;--radius:24px}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:500 16px/1.65 'Noto Sans KR',sans-serif;word-break:keep-all}button,input{font:inherit}button,a,input{touch-action:manipulation}button{cursor:pointer}button{color:inherit}button:focus-visible,a:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid var(--teal);outline-offset:4px}a{color:inherit}button{border:0}button:disabled{cursor:default;opacity:.45}.masthead{max-width:1280px;margin:auto;padding:25px 36px;display:flex;align-items:center;gap:24px}.brand{text-decoration:none;display:flex;align-items:center;gap:11px;font-size:22px;font-weight:800;letter-spacing:-1px}.brand-symbol{display:grid;place-items:center;background:var(--ink);color:var(--paper);width:35px;height:35px;border-radius:50%;font-size:33px;line-height:1}.subject{display:flex;gap:10px;align-items:center;font-size:13px;color:var(--muted)}.subject i{width:3px;height:3px;background:var(--muted);border-radius:50%}.text-button{background:none;padding:8px 0;font-size:13px;color:var(--muted)}#reset{margin-left:auto}.steps{max-width:1208px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.steps button{background:none;text-align:left;padding:18px 20px;position:relative;font-size:15px;color:var(--muted);white-space:nowrap}.steps button span{font-size:12px;margin-right:12px;font-weight:700}.steps button[aria-current]{color:var(--ink);font-weight:800}.steps button[aria-current]:after{content:'';position:absolute;bottom:-1px;left:20px;right:20px;height:3px;background:var(--orange)}main{max-width:1280px;padding:46px 36px 26px;margin:auto;min-height:650px;outline:none}.lesson-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:30px}.eyebrow{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.04em;font-weight:700;color:var(--muted);margin:0 0 12px}.eyebrow:before{content:'';width:7px;height:7px;background:var(--orange);border-radius:50%}h1{font-size:clamp(30px,3.2vw,44px);line-height:1.3;letter-spacing:-1.8px;margin:0;font-weight:800}h2{font-size:23px;letter-spacing:-.8px;line-height:1.5;margin:0 0 12px}p{margin:0 0 16px}.lead{max-width:370px;color:var(--muted);font-size:15px;margin:0 0 4px}.workspace{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(280px,1fr);gap:22px;align-items:stretch}.board{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;min-width:0}.board-top{padding:24px 28px 0;display:flex;justify-content:space-between;gap:16px;align-items:center}.small-label{font-size:13px;font-weight:700;color:var(--muted)}.board-index{font:italic 18px 'Gowun Batang',serif;color:var(--muted)}.aside{background:var(--teal-pale);border-radius:var(--radius);padding:29px 28px;display:flex;flex-direction:column;min-width:0}.aside.orange{background:var(--orange-pale)}.aside .small-label{margin-bottom:20px}.concept{border-top:1px solid #a9c7b6;padding-top:20px;margin-top:auto}.concept p{margin-bottom:0;font-size:15px}.concept strong{font-weight:800}.equation-text{font-size:30px;font-weight:800;letter-spacing:1px;margin:10px 0 20px;line-height:1.5}.fraction{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1.3;font-size:.8em;margin:0 4px}.fraction span:first-child{border-bottom:1.5px solid currentColor;padding:0 5px 3px}.fraction span:last-child{padding-top:3px}.juice-stage{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:18px;padding:26px 40px 18px}.drink{text-align:center}.drink-name{display:block;font-size:13px;color:var(--muted);margin-bottom:18px}.glass{position:relative;width:118px;height:154px;border:2px solid var(--ink);border-top:0;border-radius:0 0 25px 25px;margin:0 auto 20px;display:flex;align-items:flex-end;background:repeating-linear-gradient(to top,transparent 0,transparent 30px,#172d3312 30px,#172d3312 31px);isolation:isolate}.glass:before{content:'';position:absolute;top:-4px;left:-5px;right:-5px;height:9px;border:2px solid var(--ink);border-radius:50%;background:var(--white);z-index:2}.glass:after{content:'';position:absolute;left:14px;top:22px;width:5px;height:80px;background:#ffffff85;border-radius:4px}.liquid{width:100%;border-radius:0 0 22px 22px;transition:height .3s,background .3s;background:#f4a34b}.glass.large{width:118px;height:154px}.ratio{font-size:35px;font-weight:800;line-height:1.2;letter-spacing:2px}.orange-text{color:#b94d1e}.teal-text{color:var(--teal)}.ratio-legend{font-size:12px;color:var(--muted);margin:7px 0 0}.versus{border:1px solid var(--line);width:42px;height:42px;display:grid;place-items:center;border-radius:50%;font-size:23px}.status{margin:0 28px 24px;padding:12px 16px;background:#edf3e9;color:#285647;border-radius:12px;text-align:center;font-size:14px;font-weight:700}.status.bad{background:#fff0df;color:#8b4519}.control-label{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px;font-size:14px}.control-label output{font-size:21px;font-weight:800}input[type=range]{width:100%;accent-color:var(--ink);height:24px;cursor:pointer;margin:0}.ticks{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);padding:0 6px;margin:0 0 25px}.toggle{border:1px solid #98b7a3;background:transparent;border-radius:12px;padding:12px;font-size:14px;margin-bottom:27px;min-height:48px}.toggle[aria-pressed=true]{background:var(--ink);color:white;border-color:var(--ink)}.bottom-nav{display:flex;justify-content:space-between;align-items:center;margin-top:24px;gap:16px}.step-count{font-size:12px;color:var(--muted);letter-spacing:2px}.nav-actions{display:flex;gap:10px}.primary,.secondary{padding:12px 22px;border-radius:12px;min-height:48px;font-weight:700;font-size:14px;display:inline-flex;justify-content:center;align-items:center;gap:20px}.primary{background:var(--ink);color:var(--white)}.primary:hover{background:#2c4d53}.secondary{background:transparent;border:1px solid var(--line)}.footer{max-width:1208px;border-top:1px solid var(--line);margin:16px auto 0;padding:18px 0;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)}.formula-board{padding:27px 28px 20px}.term-labels{display:flex;justify-content:space-between;font-size:12px;margin:0 4px 10px;color:var(--muted)}.formula-inputs{display:grid;grid-template-columns:1fr 18px 1fr 22px 1fr 18px 1fr;align-items:center;gap:9px;text-align:center;font-size:27px}.formula-inputs input,.field input{min-width:0;width:100%;text-align:center;border:1px solid #c5cdc4;background:var(--white);border-radius:12px;padding:13px 5px;font-size:30px;font-weight:700;color:var(--ink)}.formula-inputs input.outer{background:var(--orange-pale);border-color:#f4ba91}.formula-inputs input.inner{background:var(--teal-pale);border-color:#b6ceba}.bracket{border:2px solid var(--orange);border-top:0;border-radius:0 0 12px 12px;text-align:center;height:25px;margin:7px 6px 0;position:relative}.bracket span{position:relative;top:12px;background:var(--white);padding:0 12px;font-size:12px;color:#9d491e}.bracket.inner-bracket{width:46%;margin:25px auto 28px;border-color:var(--teal)}.bracket.inner-bracket span{color:var(--teal)}.product-grid{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:14px 0}.product{padding:17px;background:var(--paper);border-radius:14px;text-align:center;min-width:0}.product span{display:block;font-size:12px;margin-bottom:5px;color:var(--muted)}.product strong{font-size:22px;overflow-wrap:anywhere}.product:first-child strong{color:#ae4b21}.product:last-child strong{color:var(--teal)}.equal{font-size:26px}.hint{font-size:13px;color:var(--muted);margin:12px 0 0}.presets{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 20px}.preset{background:transparent;border:1px solid #bccebf;border-radius:30px;padding:7px 14px;font-size:12px;min-height:38px}.preset:hover{background:#ffffff70}.field{display:block;margin:0 0 18px;font-size:13px}.field input{font-size:24px;margin-top:7px;padding:9px 8px}.input-pair{display:grid;grid-template-columns:1fr 20px 1fr;gap:8px;align-items:center;text-align:center}.input-pair .field{text-align:left}.input-pair>b{margin-top:10px;font-size:24px}.allocation-stage{padding:25px 28px}.total-caption{display:flex;align-items:center;gap:12px;font-size:14px;margin:10px 0 28px}.total-caption:before,.total-caption:after{content:'';flex:1;border-top:1px solid var(--ink)}.ribbon{display:flex;min-height:100px;overflow:hidden;border-radius:12px;position:relative;border:1px solid #172d3330}.ribbon-part{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;position:relative;transition:flex .25s}.ribbon-part:first-child{background:var(--orange-pale);color:#9b411d}.ribbon-part:last-child{background:var(--teal-pale);color:#205e55}.ribbon-part strong{font-size:25px;z-index:1;background:inherit;padding:0 4px;max-width:100%;overflow-wrap:anywhere}.ribbon-part span{font-size:12px;z-index:1;background:inherit;padding:0 4px}.ribbon-part .divisions{position:absolute;inset:0;display:flex;pointer-events:none}.divisions i{flex:1;border-right:1px dashed #172d333d}.divisions i:last-child{border:0}.one-part{font-size:14px;margin:18px 0 28px;text-align:center;color:var(--muted)}.allocation-calcs{display:grid;grid-template-columns:1fr 1fr;gap:12px}.allocation-calcs .product strong{font-size:19px}.validation{font-size:14px;line-height:1.7;margin:22px 0 0;text-align:center;color:#285647}.error{color:var(--red)!important;font-size:14px}.input-error{margin-bottom:14px}.answer-area{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.answer-area input{width:120px;min-width:0;border:1px solid #bdc7bb;border-radius:10px;background:var(--white);padding:9px 12px;font-size:18px}.question{padding:24px 0;border-bottom:1px solid var(--line)}.question:first-child{padding-top:0}.question-title{display:flex;align-items:baseline;gap:14px;margin-bottom:14px}.question-number{font-size:12px;color:var(--muted);flex:none}.question h2{font-size:18px;font-weight:600;margin:0;line-height:1.6;letter-spacing:-.3px}.quiz{max-width:860px}.quiz-intro{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:30px}.quiz-intro .lead{max-width:none}.quiz-count{font-size:14px;white-space:nowrap;color:var(--teal)}.choice{border:1px solid #bdc7bb;border-radius:10px;padding:9px 18px;background:var(--white);font-size:14px;min-height:44px}.choice[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:white}.feedback{font-size:14px;margin:14px 0 0}.feedback.correct{color:#286045}.feedback.incorrect{color:#9b411d}.feedback details{margin-top:7px;color:var(--muted)}summary{cursor:pointer;font-size:13px}#quiz-summary{padding:20px 0;font-weight:700}.quiz-tools{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.skip{position:fixed;top:-100px;left:10px;background:var(--ink);color:white;padding:12px;z-index:50}.skip:focus{top:10px}dialog{border:1px solid var(--line);border-radius:24px;background:var(--paper);color:var(--ink);width:min(570px,calc(100% - 32px));max-height:85vh;padding:30px}dialog::backdrop{background:#172d3366}.dialog-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.icon-button{font-size:26px;background:transparent;padding:4px 12px}.dialog-head h2{margin:0}dialog p,dialog li{font-size:14px}dialog ol{padding-left:22px}dialog li{margin:16px 0}dialog a{font-size:13px;text-underline-offset:3px}.invalid-board{padding:60px 28px;text-align:center;color:var(--red)}@media(min-width:1400px){main{padding-top:50px}.juice-stage{padding-top:35px;padding-bottom:24px}.glass{height:173px}.glass.large{height:173px}}@media(max-width:900px){.workspace{grid-template-columns:minmax(0,1.55fr) minmax(250px,1fr)}.juice-stage{padding:30px 16px;gap:8px}.glass{width:95px;height:145px}.glass.large{width:95px;height:145px}.aside{padding:25px 22px}.formula-inputs{gap:5px}.formula-inputs input{font-size:24px}.lesson-head{align-items:flex-start}.lead{max-width:300px}.product strong{font-size:18px}.steps{margin:0 24px}.steps button{padding:17px 10px;font-size:13px}.steps button span{margin-right:5px}.footer{margin:16px 36px 0}}@media(max-width:700px){.masthead{padding:20px;gap:12px}.brand{font-size:19px}.brand-symbol{width:30px;height:30px;font-size:29px}.subject{display:none}.steps{margin:0 20px}.steps button{text-align:center;padding:13px 2px;font-size:12px;white-space:normal;line-height:1.5}.steps button span{display:block;margin:0 0 3px;font-size:10px}.steps button[aria-current]:after{left:6px;right:6px}main{padding:30px 20px 20px;min-height:0}.lesson-head{display:block;margin-bottom:23px}.lead{max-width:none;margin-top:14px;font-size:14px}h1{font-size:33px;letter-spacing:-1.4px}.workspace{grid-template-columns:1fr;gap:16px}.board-top{padding:20px 22px 0}.juice-stage{padding:25px 20px 18px;gap:12px}.glass{width:100px;height:145px}.glass.large{width:100px;height:145px}.ratio{font-size:29px}.drink-name{font-size:12px}.aside{padding:24px}.aside .small-label{margin-bottom:14px}.aside .concept{margin-top:20px;padding-top:15px}.aside h2{font-size:21px}.toggle{margin-bottom:0}.ticks{margin-bottom:16px}.equation-text{font-size:26px;margin:0 0 14px}.bottom-nav{margin-top:20px}.primary,.secondary{padding:11px 17px;gap:10px}.footer{margin:8px 20px 0;padding:16px 0}.footer>span{max-width:190px;font-size:11px}.formula-board{padding:25px 18px 18px}.formula-inputs{gap:4px;grid-template-columns:1fr 10px 1fr 14px 1fr 10px 1fr;font-size:21px}.formula-inputs input{font-size:21px;padding:12px 2px;border-radius:9px}.term-labels{font-size:11px}.product{padding:13px 8px}.product strong{font-size:19px}.product-grid{gap:6px}.product span{font-size:11px}.status{margin:0 18px 20px}.allocation-stage{padding:20px}.ribbon{min-height:90px}.ribbon-part strong{font-size:22px}.allocation-calcs .product strong{font-size:16px}.one-part{font-size:13px}.quiz-intro{align-items:flex-start}.quiz-count{font-size:12px;padding-top:16px}.question h2{font-size:16px}.question-title{gap:10px}.question{padding:23px 0}.question .answer-area{padding-left:27px}.quiz-tools .primary{flex:1}.quiz-tools .secondary{flex:1}.subject{font-size:11px}.hint{font-size:12px}.input-pair input,.field input{font-size:24px}}@media(max-width:360px){main{padding-left:16px;padding-right:16px}.steps{margin:0 16px}.masthead{padding:17px 16px}.glass{width:87px}.glass.large{width:87px}.juice-stage{gap:7px;padding-left:14px;padding-right:14px}.versus{width:28px;height:28px;font-size:19px}.ratio{font-size:27px}.board-top{padding-left:18px;padding-right:18px}.formula-inputs input{font-size:18px}.product strong{font-size:16px}.allocation-calcs .product strong{font-size:14px}.footer>span{max-width:160px}.primary,.secondary{font-size:13px;padding:10px 13px}h1{font-size:30px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}@media print{body{background:white;font-size:12px}.masthead,.steps,.footer,.bottom-nav,.quiz-tools,.answer-area button,dialog{display:none!important}main{padding:0;max-width:none}.question{break-inside:avoid}.answer-area input{border:0;border-bottom:1px solid #777;border-radius:0}.question h2{font-size:14px}h1{font-size:25px}.lesson-head{margin-bottom:15px}.question{padding:14px 0}.feedback{font-size:12px}}
</style>
</head>
<body>
<a class="skip" href="#main">본문으로</a>
<header class="masthead"><a class="brand" href="#" aria-label="비례 실험실 첫 화면"><span class="brand-symbol" aria-hidden="true">:</span>비례 실험실</a><span class="subject">초등 6학년 <i></i> 수학</span><button id="reset" class="text-button">처음부터 ↺</button></header>
<nav class="steps" aria-label="수업 순서">
  <button data-step="0" aria-current="step">같은 비 찾기</button>
  <button data-step="1">비례식 탐구</button>
  <button data-step="2">비례배분</button>
  <button data-step="3">스스로 확인</button>
</nav>
<main id="main" tabindex="-1"></main>
<footer class="footer"><button id="teacher-open" class="text-button">수업 안내 ↗</button></footer>
<dialog id="teacher"><div class="dialog-head"><h2>수업 안내</h2><button id="teacher-close" class="icon-button" aria-label="수업 안내 닫기">×</button></div><p>초등 6학년 · 비례식과 비례배분</p><ol><li><b>같은 비 찾기 · 7분</b><br>“양이 두 배가 되면 맛도 바뀔까?” 물을 한 칸 더 넣은 경우와 비교합니다.</li><li><b>비례식 탐구 · 10분</b><br>외항과 내항을 짚고, 두 곱이 같은지 확인합니다. 한 수만 바꿔 반례도 만듭니다.</li><li><b>비례배분 · 13분</b><br>리본 전체를 비의 합만큼 나누고, 각 몫을 구합니다. 두 몫의 합과 비를 함께 확인합니다.</li><li><b>스스로 확인 · 10분</b><br>6문항을 풀고 풀이를 비교합니다. 오답은 다시 고칠 수 있습니다.</li></ol><p>조작값과 확인 문제 답은 이 화면을 사용하는 동안 유지됩니다. 새로고침하면 초기화됩니다.</p><details><summary>학습 범위 참고</summary><p>비례식의 뜻과 성질, 주어진 양의 비례배분을 다룹니다. 예제와 문제는 직접 구성했습니다.</p><a href="https://www.ebsmath.co.kr/myPage/probDetail?paperTab=whole&rscSno=29424" target="_blank" rel="noopener">EBSMath · 비례식과 비례배분</a></details></dialog>
<script>'use strict';
const $=s=>document.querySelector(s);
const state={step:0,scale:2,extra:false,terms:['2','3','4','6'],total:'40',a:'2',b:'3',answers:{},graded:false};
const gcd=(a,b)=>b?gcd(b,a%b):a;
function rat(n,d=1n){if(d===0n)throw Error('분모는 0이 될 수 없어요.');if(d<0n){n=-n;d=-d}const g=gcd(n<0n?-n:n,d);return {n:n/g,d:d/g}}
function parse(text){const s=String(text).trim();if(!s||s.length>24)throw Error('수를 입력해 주세요.');if(!/^\d{1,6}(?:\.\d{1,4})?(?:\s*\/\s*\d{1,6}(?:\.\d{1,4})?)?$/.test(s))throw Error('양수를 입력해 주세요. 소수 또는 1/2처럼 분수도 쓸 수 있어요.');const dec=x=>{const [n,f='']=x.trim().split('.');return rat(BigInt(n+f),10n**BigInt(f.length))};const parts=s.split('/');const r=parts.length===2?div(dec(parts[0]),dec(parts[1])):dec(s);if(r.n<=0n||num(r)>10000)throw Error('0보다 크고 10,000 이하인 수를 입력해 주세요.');return r}
const add=(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d);
const mul=(a,b)=>rat(a.n*b.n,a.d*b.d);
const div=(a,b)=>rat(a.n*b.d,a.d*b.n);
const eq=(a,b)=>a.n===b.n&&a.d===b.d;
const num=a=>Number(a.n)/Number(a.d);
function fmt(a){if(a.d===1n)return String(a.n);let d=a.d;while(d%2n===0n)d/=2n;while(d%5n===0n)d/=5n;if(d===1n&&Number.isInteger(num(a)*10000))return String(num(a));return `${a.n}/${a.d}`}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function heading(tag,title,desc){return `<div class="lesson-head"><div><h1>${title}</h1></div><p class="lead">${desc}</p></div>`}
function bottom(){return `<div class="bottom-nav"><span class="step-count">0${state.step+1} / 04</span><div class="nav-actions">${state.step?'<button class="secondary" id="prev">← 이전</button>':''}${state.step<3?'<button class="primary" id="next">다음 활동 <span>→</span></button>':'<button class="secondary" id="back-explore">비례배분 다시 보기 ↗</button>'}</div></div>`}
function go(step){state.step=step;render();$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})}
function render(){document.querySelectorAll('[data-step]').forEach(b=>{b.removeAttribute('aria-current');if(+b.dataset.step===state.step)b.setAttribute('aria-current','step')});$('#main').innerHTML=[juice,proportion,allocation,quiz][state.step]()+bottom();$('#prev')?.addEventListener('click',()=>go(state.step-1));$('#next')?.addEventListener('click',()=>go(state.step+1));$('#back-explore')?.addEventListener('click',()=>go(2));[bindJuice,bindProportion,bindAllocation,bindQuiz][state.step]()}
function juice(){return heading('같은 비 찾기','양은 달라도,<br>맛은 같을까?','오렌지 원액과 물의 양을 함께 바꿔 보세요.')+`<div class="workspace"><section class="board" aria-label="두 주스의 비 비교"><div class="board-top"><span class="small-label">오렌지 원액 : 물</span></div><div class="juice-stage"><div class="drink"><span class="drink-name">처음 만든 주스</span><div class="glass" aria-hidden="true"><div class="liquid" style="height:21%"></div></div><div class="ratio"><span class="orange-text">2</span> : <span class="teal-text">3</span></div><p class="ratio-legend">원액 2칸 · 물 3칸</p></div><div class="versus" id="juice-equal" aria-hidden="true">=</div><div class="drink"><span class="drink-name">양을 바꾼 주스</span><div class="glass large" aria-hidden="true"><div class="liquid" id="juice-liquid"></div></div><div class="ratio" id="juice-ratio"></div><p class="ratio-legend" id="juice-legend"></p></div></div><p class="status" id="juice-status" role="status"></p></section><section class="aside"><p class="small-label">주스 양 바꾸기</p><label class="control-label" for="scale">원액과 물을 각각 <output id="scale-out">2배</output></label><input id="scale" type="range" min="1" max="4" step="1" value="${state.scale}"><div class="ticks" aria-hidden="true"><span>1배</span><span>2배</span><span>3배</span><span>4배</span></div><button class="toggle" id="extra" aria-pressed="${state.extra}">물을 한 칸 더 넣으면?</button><div class="concept"><h2>같은 맛의 비밀은 ‘비’</h2><p>비의 전항과 후항에 <strong>0이 아닌 같은 수</strong>를 곱하거나 나누어도 비율은 같아요.</p></div></section></div>`}
function updateJuice(){const a=2*state.scale,b=3*state.scale+(state.extra?1:0);$('#scale-out').textContent=`${state.scale}배`;$('#juice-ratio').innerHTML=`<span class="orange-text">${a}</span> : <span class="teal-text">${b}</span>`;$('#juice-legend').textContent=`원액 ${a}칸 · 물 ${b}칸`;$('#juice-liquid').style.height=`${(a+b)/21*88}%`;$('#juice-liquid').style.background=state.extra?'#f7bc6a':'#f4a34b';$('#juice-equal').textContent=state.extra?'≠':'=';$('#juice-status').classList.toggle('bad',state.extra);$('#juice-status').textContent=state.extra?`2 : 3 ≠ ${a} : ${b} · 물의 비율이 커져 맛이 연해져요.`:`2 : 3 = ${a} : ${b} · 비율이 같아 맛도 같아요.`;$('#extra').setAttribute('aria-pressed',String(state.extra))}
function bindJuice(){updateJuice();$('#scale').addEventListener('input',e=>{state.scale=+e.target.value;updateJuice()});$('#extra').addEventListener('click',()=>{state.extra=!state.extra;updateJuice()})}
function proportion(){return heading('비례식 탐구','같은 비를 식으로<br>이어 볼까요?','비율이 같은 두 비를 등호로 나타낸 식이 비례식이에요.')+`<div class="workspace"><section class="board"><div class="board-top"><span class="small-label">수를 바꿔 두 곱을 비교하세요.</span></div><div class="formula-board"><div class="term-labels"><span>전항 : 후항</span><span>전항 : 후항</span></div><div class="formula-inputs">${state.terms.map((v,i)=>`${i===1||i===3?'<span>:</span>':i===2?'<span id="proportion-equal">=</span>':''}<input type="text" inputmode="text" class="${i===0||i===3?'outer':'inner'}" id="term-${i}" aria-label="${['첫 번째 비의 전항','첫 번째 비의 후항','두 번째 비의 전항','두 번째 비의 후항'][i]}" value="${esc(v)}" maxlength="24">`).join('')}</div><div class="bracket"><span>외항 · 양 끝의 두 수</span></div><div class="bracket inner-bracket"><span>내항 · 안쪽의 두 수</span></div><div class="product-grid"><div class="product"><span>외항의 곱</span><strong id="outer-product"></strong></div><div class="equal" id="product-equal">=</div><div class="product"><span>내항의 곱</span><strong id="inner-product"></strong></div></div><p class="hint">이 탐구에서는 양수를 써요. 소수·분수도 입력할 수 있어요.</p></div><p class="status" id="proportion-status" role="status"></p></section><section class="aside orange"><p class="small-label">비례식의 성질</p><h2>외항의 곱과<br>내항의 곱이 같아요.</h2><p class="equation-text">a : b = c : d<br><span style="font-size:.7em">a × d = b × c</span></p><div class="presets"><button class="preset" data-terms="2,3,4,6">같은 비</button><button class="preset" data-terms="2,3,4,7">한 수만 바꾸기</button><button class="preset" data-terms="0.5,1,2,4">소수로 보기</button></div><div class="concept" style="border-color:#dfb89d"><p><strong>어떤 수를 바꾸면</strong><br>다시 비례식이 성립할까요?</p></div></section></div>`}
function updateProportion(){try{const [a,b,c,d]=state.terms.map(parse),outer=mul(a,d),inner=mul(b,c),ok=eq(outer,inner);$('#outer-product').textContent=`${fmt(a)} × ${fmt(d)} = ${fmt(outer)}`;$('#inner-product').textContent=`${fmt(b)} × ${fmt(c)} = ${fmt(inner)}`;$('#product-equal').textContent=ok?'=':'≠';$('#proportion-equal').textContent=ok?'=':'≠';$('#proportion-status').className=`status${ok?'':' bad'}`;$('#proportion-status').textContent=ok?'두 곱이 같아요. 비례식이 성립해요.':'두 곱이 달라요. 이 등식은 성립하지 않아요.'}catch(e){$('#outer-product').textContent='—';$('#inner-product').textContent='—';$('#product-equal').textContent='?';$('#proportion-equal').textContent='?';$('#proportion-status').className='status bad';$('#proportion-status').textContent=e.message}}
function bindProportion(){updateProportion();state.terms.forEach((_,i)=>$('#term-'+i).addEventListener('input',e=>{state.terms[i]=e.target.value;updateProportion()}));document.querySelectorAll('[data-terms]').forEach(b=>b.addEventListener('click',()=>{state.terms=b.dataset.terms.split(',');state.terms.forEach((v,i)=>$('#term-'+i).value=v);updateProportion()}))}
function allocation(){return heading('비례배분','똑같이 말고,<br>비에 맞게 나눠요.','리본 전체를 두 모둠에 주어진 비로 나누어 보세요.')+`<div class="workspace"><section class="board"><div class="board-top"><span class="small-label">리본 나누기</span></div><div id="allocation-visual"></div></section><section class="aside"><p class="small-label">어떻게 나눌까요?</p><label class="field" for="total">리본 전체 길이 (cm)<input id="total" type="text" inputmode="text" maxlength="24" value="${esc(state.total)}"></label><div class="input-pair"><label class="field" for="part-a">가 모둠의 비<input id="part-a" type="text" inputmode="text" maxlength="24" value="${esc(state.a)}"></label><b aria-hidden="true">:</b><label class="field" for="part-b">나 모둠의 비<input id="part-b" type="text" inputmode="text" maxlength="24" value="${esc(state.b)}"></label></div><div id="allocation-error" class="error input-error" role="status"></div><div class="presets" style="margin-top:0"><button class="preset" data-allocation="40,2,3">40 cm · 2 : 3</button><button class="preset" data-allocation="7.5,1,2">7.5 cm · 1 : 2</button><button class="preset" data-allocation="12,1/2,1/3">분수의 비</button></div><div class="concept"><p><strong>전체 × (자기 비 ÷ 비의 합)</strong><br>소수·분수도 가능해요. 리본은 잘라 나눌 수 있어요.</p></div></section></div>`}
function updateAllocation(){try{const T=parse(state.total),a=parse(state.a),b=parse(state.b),sum=add(a,b),unit=div(T,sum),A=mul(unit,a),B=mul(unit,b);const ai=a.n,bi=b.n;const simple=a.d===1n&&b.d===1n&&sum.n<=20n;const ticks=n=>simple?`<div class="divisions" aria-hidden="true">${'<i></i>'.repeat(Number(n))}</div>`:'';$('#allocation-error').textContent='';$('#allocation-visual').innerHTML=`<div class="allocation-stage"><div class="total-caption">전체 ${fmt(T)} cm</div><div class="ribbon" role="img" aria-label="가 모둠 ${fmt(A)} 센티미터, 나 모둠 ${fmt(B)} 센티미터"><div class="ribbon-part" style="flex:${num(a)}">${ticks(ai)}<span>가 모둠</span><strong>${fmt(A)} cm</strong></div><div class="ribbon-part" style="flex:${num(b)}">${ticks(bi)}<span>나 모둠</span><strong>${fmt(B)} cm</strong></div></div><p class="one-part">비의 합 ${fmt(a)} + ${fmt(b)} = ${fmt(sum)}<br>비 1에 해당하는 길이: ${fmt(T)} ÷ ${fmt(sum)} = ${fmt(unit)} cm</p><div class="allocation-calcs"><div class="product"><span>가 모둠의 몫</span><strong>${fmt(T)} × (${fmt(a)} ÷ ${fmt(sum)})<br>= ${fmt(A)} cm</strong></div><div class="product"><span>나 모둠의 몫</span><strong>${fmt(T)} × (${fmt(b)} ÷ ${fmt(sum)})<br>= ${fmt(B)} cm</strong></div></div><p class="validation">${fmt(A)} + ${fmt(B)} = ${fmt(T)} cm<br>두 몫의 비 ${fmt(A)} : ${fmt(B)} = ${fmt(a)} : ${fmt(b)}</p></div>`}catch(e){$('#allocation-error').textContent=e.message;$('#allocation-visual').innerHTML='<p class="invalid-board">전체 길이와 두 비를 확인해 주세요.</p>'}}
function bindAllocation(){updateAllocation();[['total','total'],['part-a','a'],['part-b','b']].forEach(([id,key])=>$('#'+id).addEventListener('input',e=>{state[key]=e.target.value;updateAllocation()}));document.querySelectorAll('[data-allocation]').forEach(b=>b.addEventListener('click',()=>{[state.total,state.a,state.b]=b.dataset.allocation.split(',');$('#total').value=state.total;$('#part-a').value=state.a;$('#part-b').value=state.b;updateAllocation()}))}
const questions=[
 {id:'q1',title:'3 : 5와 비율이 같은 비는 무엇인가요?',choices:['6 : 10','6 : 8','9 : 10'],answer:'6 : 10',explain:'3과 5에 각각 2를 곱하면 6 : 10이 돼요.'},
 {id:'q2',title:'2 : 3 = 8 : 12에서 외항의 곱은 얼마인가요?',answer:'24',explain:'양 끝의 수인 2와 12가 외항이에요. 2 × 12 = 24예요.'},
 {id:'q3',title:'4 : 7 = 12 : □에서 □에 알맞은 수를 구하세요.',answer:'21',explain:'4 × □ = 7 × 12 = 84이므로 □ = 21이에요.'},
 {id:'q4',title:'리본 35 cm를 가 : 나 = 2 : 5로 나눕니다. 가 모둠의 몫은?',answer:'10',unit:'cm',explain:'35 × (2 ÷ 7) = 10 cm예요. 나 모둠은 25 cm예요.'},
 {id:'q5',title:'끈 7.5 m를 1 : 2로 나눕니다. 작은 몫은 얼마인가요?',answer:'2.5',unit:'m',explain:'비의 합은 3이에요. 7.5 × (1 ÷ 3) = 2.5 m예요. 5/2도 같은 답이에요.'},
 {id:'q6',title:'리본 40 cm를 2 : 3으로 나눴더니 20 cm씩이 되었어요. 맞는 방법일까요?',choices:['맞아요','다시 나눠야 해요'],answer:'다시 나눠야 해요',explain:'합은 40 cm지만 20 : 20은 1 : 1이에요. 16 cm와 24 cm로 나누어야 2 : 3이 돼요.'}
];
function isCorrect(q){const v=state.answers[q.id];if(q.choices)return v===q.answer;try{return eq(parse(v??''),parse(q.answer))}catch{return false}}
function feedback(q){const v=state.answers[q.id],correct=isCorrect(q);return `<div class="feedback ${correct?'correct':'incorrect'}" id="feedback-${q.id}" role="status">${correct?'맞았어요.':v?'다시 생각해 보세요.':'답을 입력하거나 선택해 주세요.'}<details><summary>풀이 보기</summary><p>${q.explain}</p></details></div>`}
function quiz(){return heading('스스로 확인','이제, 내 힘으로.','비와 곱, 그리고 두 몫의 합을 확인해 보세요.')+`<section class="quiz" aria-label="확인 문제"><div class="quiz-intro"><p class="lead">수는 소수나 분수로 입력할 수 있어요.</p><span class="quiz-count" id="quiz-count"></span></div><form id="quiz-form">${questions.map((q,i)=>`<section class="question" aria-labelledby="title-${q.id}"><div class="question-title"><span class="question-number">0${i+1}</span><h2 id="title-${q.id}">${q.title}</h2></div><div class="answer-area">${q.choices?q.choices.map((c,j)=>`<button type="button" class="choice" data-q="${q.id}" data-choice="${j}" aria-pressed="${state.answers[q.id]===c}">${c}</button>`).join(''):`<input type="text" inputmode="text" maxlength="24" id="answer-${q.id}" aria-labelledby="title-${q.id}" ${q.unit?`aria-describedby="unit-${q.id}"`:''} value="${esc(state.answers[q.id]??'')}" autocomplete="off">${q.unit?`<span id="unit-${q.id}">${q.unit}</span>`:''}`}</div>${state.graded?feedback(q):''}</section>`).join('')}<div class="quiz-tools"><button class="primary" type="submit">답 확인하기 <span>↗</span></button><button class="secondary" id="quiz-retry" type="button">다시 풀기 ↺</button><button class="secondary" id="print" type="button">인쇄</button></div><p id="quiz-summary" role="status">${state.graded?summary():''}</p></form></section>`}
function summary(){const c=questions.filter(isCorrect).length;return `${questions.length}문항 중 ${c}문항을 맞혔어요. ${c===questions.length?'비례식과 비례배분을 잘 이해했어요!':'풀이를 확인하고 답을 고친 뒤 다시 확인해 보세요.'}`}
function updateCount(){$('#quiz-count').textContent=`${questions.filter(q=>!!state.answers[q.id]?.trim()).length} / 6 응답`}
function clearGrade(){if(state.graded){state.graded=false;document.querySelectorAll('.feedback').forEach(e=>e.remove());$('#quiz-summary').textContent=''}}
function bindQuiz(){updateCount();document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{clearGrade();state.answers[b.dataset.q]=questions.find(q=>q.id===b.dataset.q).choices[+b.dataset.choice];document.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updateCount()}));questions.filter(q=>!q.choices).forEach(q=>$('#answer-'+q.id).addEventListener('input',e=>{clearGrade();state.answers[q.id]=e.target.value;updateCount()}));$('#quiz-form').addEventListener('submit',e=>{e.preventDefault();state.graded=true;const y=window.scrollY;render();window.scrollTo({top:y,behavior:'instant'});$('#quiz-summary').scrollIntoView({behavior:'instant',block:'center'})});$('#quiz-retry').addEventListener('click',()=>{state.answers={};state.graded=false;render();$('#title-q1').scrollIntoView({behavior:'instant',block:'center'})});$('#print').addEventListener('click',()=>window.print())}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.step)));
$('.brand').addEventListener('click',e=>{e.preventDefault();go(0)});
$('#reset').addEventListener('click',()=>{Object.assign(state,{step:0,scale:2,extra:false,terms:['2','3','4','6'],total:'40',a:'2',b:'3',answers:{},graded:false});go(0)});
$('#teacher-open').addEventListener('click',()=>$('#teacher').showModal());$('#teacher-close').addEventListener('click',()=>$('#teacher').close());
render();
</script></body></html>

~~~~


## File: assets/ratio-lesson.contract.json

~~~~json
{
  "version": 1,
  "title": "비례식·비례배분 기준 자료",
  "scenes": [
    {
      "name": "같은 비",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"0\"]"
        }
      ]
    },
    {
      "name": "비례식",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"1\"]"
        }
      ]
    },
    {
      "name": "비례배분",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        }
      ]
    },
    {
      "name": "확인 문제",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"3\"]"
        }
      ]
    }
  ],
  "cases": [
    {
      "name": "비례식의 같은 비",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"1\"]"
        },
        {
          "action": "fill",
          "selector": "#term-0",
          "value": "2"
        },
        {
          "action": "fill",
          "selector": "#term-1",
          "value": "3"
        },
        {
          "action": "fill",
          "selector": "#term-2",
          "value": "4"
        },
        {
          "action": "fill",
          "selector": "#term-3",
          "value": "6"
        }
      ],
      "expect": [
        {
          "selector": "#product-equal",
          "text": "="
        },
        {
          "selector": "#outer-product",
          "includes": [
            "12"
          ]
        },
        {
          "selector": "#inner-product",
          "includes": [
            "12"
          ]
        },
        {
          "selector": "#proportion-equal",
          "text": "="
        }
      ]
    },
    {
      "name": "다른 비에 등호를 남기지 않음",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"1\"]"
        },
        {
          "action": "fill",
          "selector": "#term-0",
          "value": "2"
        },
        {
          "action": "fill",
          "selector": "#term-1",
          "value": "3"
        },
        {
          "action": "fill",
          "selector": "#term-2",
          "value": "4"
        },
        {
          "action": "fill",
          "selector": "#term-3",
          "value": "7"
        }
      ],
      "expect": [
        {
          "selector": "#product-equal",
          "text": "≠"
        },
        {
          "selector": "#outer-product",
          "includes": [
            "14"
          ]
        },
        {
          "selector": "#inner-product",
          "includes": [
            "12"
          ]
        },
        {
          "selector": "#proportion-equal",
          "text": "≠"
        }
      ]
    },
    {
      "name": "비례식 소수",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"1\"]"
        },
        {
          "action": "fill",
          "selector": "#term-0",
          "value": "0.5"
        },
        {
          "action": "fill",
          "selector": "#term-1",
          "value": "1"
        },
        {
          "action": "fill",
          "selector": "#term-2",
          "value": "2"
        },
        {
          "action": "fill",
          "selector": "#term-3",
          "value": "4"
        }
      ],
      "expect": [
        {
          "selector": "#product-equal",
          "text": "="
        },
        {
          "selector": "#outer-product",
          "includes": [
            "2"
          ]
        },
        {
          "selector": "#proportion-equal",
          "text": "="
        }
      ]
    },
    {
      "name": "비례배분 정답과 실제 그림의 비",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "40"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "2"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "3"
        }
      ],
      "expect": [
        {
          "selector": ".ribbon-part:first-child",
          "text": "가 모둠 16 cm"
        },
        {
          "selector": ".ribbon-part:first-child",
          "widthRatio": {
            "other": ".ribbon-part:last-child",
            "expected": 0.6666666666666666
          }
        },
        {
          "selector": ".validation",
          "includes": [
            "40 cm"
          ]
        },
        {
          "selector": ".ribbon-part:last-child",
          "text": "나 모둠 24 cm"
        }
      ]
    },
    {
      "name": "전체 변경 뒤 그림·검산 갱신",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "80"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "2"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "3"
        }
      ],
      "expect": [
        {
          "selector": ".ribbon-part:first-child",
          "text": "가 모둠 32 cm"
        },
        {
          "selector": ".total-caption",
          "text": "전체 80 cm"
        },
        {
          "selector": ".validation",
          "includes": [
            "80 cm"
          ]
        },
        {
          "selector": ".ribbon-part:last-child",
          "text": "나 모둠 48 cm"
        }
      ]
    },
    {
      "name": "소수 전체량 지원",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "7.5"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "1"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "2"
        }
      ],
      "expect": [
        {
          "selector": ".ribbon-part:first-child",
          "text": "가 모둠 2.5 cm"
        },
        {
          "selector": ".ribbon-part:last-child",
          "text": "나 모둠 5 cm"
        }
      ]
    },
    {
      "name": "분수의 비 지원",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "12"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "1/2"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "1/3"
        }
      ],
      "expect": [
        {
          "selector": ".ribbon-part:first-child",
          "text": "가 모둠 7.2 cm"
        },
        {
          "selector": ".ribbon-part:last-child",
          "text": "나 모둠 4.8 cm"
        }
      ]
    },
    {
      "name": "0 입력 오류와 정상 복구",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "40"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "0"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "3"
        }
      ],
      "expect": [
        {
          "selector": "#allocation-error",
          "includes": [
            "0보다"
          ]
        },
        {
          "selector": ".invalid-board",
          "includes": [
            "확인"
          ]
        }
      ]
    },
    {
      "name": "오류 이후 정상 결과 복구",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"2\"]"
        },
        {
          "action": "fill",
          "selector": "#total",
          "value": "40"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "0"
        },
        {
          "action": "fill",
          "selector": "#part-b",
          "value": "3"
        },
        {
          "action": "fill",
          "selector": "#part-a",
          "value": "2"
        }
      ],
      "expect": [
        {
          "selector": ".ribbon-part:first-child",
          "text": "가 모둠 16 cm"
        },
        {
          "selector": ".ribbon-part:last-child",
          "text": "나 모둠 24 cm"
        }
      ]
    },
    {
      "name": "분수 동치 정답 채점",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"3\"]"
        },
        {
          "action": "fill",
          "selector": "#answer-q5",
          "value": "5/2"
        },
        {
          "action": "click",
          "selector": "#quiz-form button[type=\"submit\"]"
        }
      ],
      "expect": [
        {
          "selector": "#feedback-q5",
          "includes": [
            "맞았어요."
          ]
        }
      ]
    },
    {
      "name": "답 수정 시 이전 채점 해제",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"3\"]"
        },
        {
          "action": "fill",
          "selector": "#answer-q5",
          "value": "5/2"
        },
        {
          "action": "click",
          "selector": "#quiz-form button[type=\"submit\"]"
        },
        {
          "action": "fill",
          "selector": "#answer-q5",
          "value": "3"
        },
        {
          "action": "click",
          "selector": "#quiz-form button[type=\"submit\"]"
        }
      ],
      "expect": [
        {
          "selector": "#feedback-q5",
          "includes": [
            "다시 생각해 보세요."
          ]
        }
      ]
    },
    {
      "name": "다시 풀기의 입력·결과 초기화",
      "steps": [
        {
          "action": "click",
          "selector": "[data-step=\"3\"]"
        },
        {
          "action": "fill",
          "selector": "#answer-q5",
          "value": "5/2"
        },
        {
          "action": "click",
          "selector": "#quiz-form button[type=\"submit\"]"
        },
        {
          "action": "click",
          "selector": "#quiz-retry"
        }
      ],
      "expect": [
        {
          "selector": "#answer-q5",
          "value": ""
        },
        {
          "selector": "#quiz-count",
          "text": "0 / 6 응답"
        },
        {
          "selector": "#quiz-form",
          "excludes": [
            "맞았어요.",
            "다시 생각해 보세요."
          ]
        }
      ]
    },
    {
      "name": "기준 디자인의 배경·컵선·조작부 보존",
      "steps": [],
      "expect": [
        {
          "selector": "body",
          "style": {
            "background-color": "rgb(246, 244, 236)"
          }
        },
        {
          "selector": ".glass:not(.large)",
          "style": {
            "border-left-style": "solid"
          }
        },
        {
          "selector": ".aside",
          "style": {
            "background-color": "rgb(217, 235, 223)"
          }
        }
      ]
    }
  ]
}

~~~~


## File: scripts/verify_lesson.mjs

~~~~javascript
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

~~~~


## File: scripts/harness.test.mjs

~~~~javascript
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

~~~~


## File: package.json

~~~~json
{
  "name": "hallmark-classroom-harness",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test scripts/harness.test.mjs",
    "verify:reference": "node scripts/verify_lesson.mjs assets/ratio-lesson.html --contract assets/ratio-lesson.contract.json"
  },
  "devDependencies": { "playwright": "1.63.0" }
}

~~~~


## File: package-lock.json

~~~~json
{
  "name": "hallmark-classroom-harness",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "hallmark-classroom-harness",
      "devDependencies": {
        "playwright": "1.63.0"
      }
    },
    "node_modules/playwright": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.63.0.tgz",
      "integrity": "sha512-+7ziBLidS4NaNCdt57SUDT+wYmmd5fmiQejUic/kb+YsYSCPyOOE9sebzMjNmQrsnNpDJqd4WHvV/8lfKfUDUg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.63.0.tgz",
      "integrity": "sha512-rYCsBF/M5HjUch52bbtVONEFjv6Xu8sm8h72dNlR5bzIE1fvC/bxgspzkjSfU+MweEMmPM8KJebG6nnyxo5mCg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    }
  }
}

~~~~


## File: third_party/superpowers/verification-before-completion.md

~~~~markdown
---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion

## Overview

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

~~~~


## File: third_party/superpowers/LICENSE

~~~~text
MIT License

Copyright (c) 2025 Jesse Vincent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

~~~~
