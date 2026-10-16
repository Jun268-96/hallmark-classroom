# Hallmark Classroom · Complete Web Instructions

사용자가 이 지침과 수정할 자료를 제공하면, 짧은 수정 요청도 아래 기본 작업으로 실행하세요. 이 문서에는 필요한 지침과 수업별 패턴 전체가 포함되어 있습니다.

# Hallmark Classroom

A classroom-focused fork of the local Hallmark skill. Keep its intentional hierarchy, readable typography, restrained visual language, and purposeful feedback. Replace its theme-first page workflow with **learning action → information reduction → spatial composition → visible consequence → styling**.

## 짧은 요청으로 실행하기

이 지침은 AI 사용에 익숙하지 않은 교사가 **저장소 링크 + “이걸로 수정해줘”** 정도만 입력해도 작동하도록 작성되었다. 사용자가 이런 요청과 수정할 자료를 제공하면 다음을 수행한다.

- **기본 작업은 구조 간소화다.** 사용자가 “텍스트를 줄여”, “카드를 합쳐”를 추가로 적을 필요가 없다. 아래 적용 계약을 기본값으로 사용한다. 구체적으로 범위를 제한한 사용자 요청은 그 제한을 따른다.
- **수정 대상은 사용자의 자료다.** 현재 대화에서 제공한 최신 HTML·앱·프로젝트를 읽는다. 이 스킬 저장소 자체나 예시를 고치는 작업으로 오해하지 않는다. 대상이 없거나 실제로 모호할 때만 필요한 질문 하나를 한다.
- **자료가 충분하면 바로 작업한다.** 학년·활동·현재 기능은 자료와 대화에서 파악하고, 색상·폰트·레이아웃 취향을 다시 묻거나 사용자에게 긴 프롬프트 작성을 요구하지 않는다. 기본 경로는 분석 → 재구성 → 구현 → 가능한 검증이며, 계획만 제시하고 끝내지 않는다.
- **실제 결과물을 돌려준다.** 단일 HTML이면 수정된 실행 가능한 전체 HTML을, 기존 프로젝트면 그 프로젝트 안의 실제 변경을 제공한다. 기존 기능을 남기고 설명·배치를 재구성한다. 사용자가 별도 요청하지 않은 설치·공개 배포는 하지 않는다.
- **읽기 실패는 정확히 알린다.** 사용할 수 있는 링크 읽기 도구가 있다면 저장소의 README 또는 통합 지침을 실제로 읽는다. 이미 이 본문을 읽었다면 다른 파일을 열어야만 시작할 수 있다고 하지 않는다. 링크나 수정 자료에 접근할 수 없으면 접근하지 못한 대상을 짧게 알리고 필요한 자료만 요청한다. 읽지 않은 지침을 적용했다고 주장하지 않는다.

이 정책은 이 문서 사용을 요청한 사용자의 작업 범위 안에서만 적용한다. 질문·비교·검토만 요청했다면 임의로 구현하지 않는다.

## 적용 계약 · 구조 변경이 먼저

이 스킬로 “수정해줘”라는 짧은 요청 및 “간소화”, “재구성”, “확 바꿔줘”라는 요청에는 아래 기준을 적용한다. 사용자가 색상만 바꾸라고 한 경우나 읽기 자체가 학습인 자료에는 범위를 넓혀 적용하지 않는다.

1. **원래 배치를 보존해야 한다고 해석하지 않는다.** 기능·수업 내용·데이터·정답 로직을 보존하되, 설명 카드와 컨테이너는 통합·이동·재배치한다. CSS와 문구만 손보고 끝내지 않는다.
2. **첫 화면에서 바로 활동한다.** 조작·탐구 자료는 짧은 질문, 큰 학습 대상, 가까운 조작부로 시작한다. 개념 요약은 필요할 때 접근할 수 있게 옮긴다. 긴 개념 소개를 먼저 통과해야 활동하는 구조를 그대로 두지 않는다.
3. **텍스트와 독립 설명 영역을 실제로 줄인다.** 정보가 많은 조작 자료에서는 기본 화면의 비필수 설명 분량과 독립 설명 패널 수를 각각 절반 이하로 줄이는 것을 기본 목표로 삼는다. 의미·조건·접근성을 지키기 어려우면 수치 달성 대신 구체적인 이유와 대안을 제시한다. 글자 축소, 화면 밖 밀어내기, 의미를 잃은 아이콘 치환으로 수치를 맞추지 않는다.
4. **학습 대상이 화면의 중심을 차지한다.** 그래프·도형·분할 막대·모형·문제와 답안 등 현재 과제의 핵심을 크게 배치한다. 넓은 빈 카드 안에 작은 시각화만 넣지 않는다. 비필수 설명이 핵심 대상보다 더 많은 시선을 차지하면 다시 구성한다.
5. **같은 카드 구조는 완료가 아니다.** 장식만 빼거나 이름만 바꾼 카드가 같은 위치에 남으면 다시 작업한다. 통합·이동된 정보와 확대된 학습 대상을 실제 변경의 증거로 확인한다. 내용이 정말 필요한 읽기·비교 과제에는 적합한 구조를 보존한다.
6. **구조가 바뀐 뒤 스타일을 다듬는다.** 색, 폰트, 그림자, 라운딩, 아이콘, 샘플 숫자 변경은 구조 개선 실적으로 세지 않는다. `Hallmark`, `Classroom Edition`, `PRINCIPLE 01` 같은 스킬명·장식 영어를 학습 화면에 새로 넣지 않는다.

The finished material should let a student see what to do and see what changed. These are acceptance criteria for an authorized substantial redesign, not permission to remove required activities or rewrite unrelated application logic.

## Scope and starting point

- Read the existing material and relevant lesson requirements before changing it. Identify the learner, the task, the device, and the mathematical or subject relationship the interface must convey. Infer settled details from the conversation; ask only when a missing answer changes the work.
- Describe the central learner action in one sentence, such as: “Change the ratio and predict each share.” This is an internal design decision, not another introductory card on the page.
- Preserve working routes, data, grading, saved state, and required lesson content. **Preserve capabilities, not the old arrangement.** Changing layout files, component grouping, and the default activity view inside the target is part of a substantial redesign. Do not replace a working application with a disconnected mockup or silently remove a requested activity.
- For audit-only or planning-only requests, return the diagnosis or plan and stop before editing. A redesign request authorizes relevant copy/layout changes, not deployment, production data changes, or unrelated rewrites.
- Apply this workflow within the requested screen or component. Do not force an entire app into one activity screen. Dashboards still need their real information and working navigation.

## 1. Reduce the information before choosing a look

Classify each existing item by its job:

| Job | Treatment |
| --- | --- |
| Current question, necessary condition, control label | Keep in the activity view |
| Result or evidence students are meant to discover | Reveal at the appropriate point in the activity |
| Long explanation, derivation, extra example, teacher guidance | Put in a clearly named secondary view when still required |
| Repeated title, instructions obvious from the control, decorative slogan | Remove or merge |
| Attribution or other required notice | Preserve in a readable, appropriate place |

Default to a short question or action sentence instead of an explanatory introduction. Keep essential conditions and vocabulary: shortening must not change the task. Remove duplicated explanatory prose rather than just paraphrasing each sentence. Do not replace five text cards with five accordions or one modal containing the same undifferentiated wall of cards. Group secondary explanation around a specific learner question, with a clearly named way to reach it.

Before styling, make a compact internal content map: **keep here / merge / move to a secondary view / remove as duplicate**. Name the concrete destinations for required content and how existing activities remain reachable. Implement the map; a proposed map alone is not completion of a build request. If structural changes cannot be made within the user's explicit scope, state that limit instead of presenting cosmetic changes as the requested redesign.

## 2. Give the activity the space

- Make the object students manipulate or inspect the visual centre: a quantity model, map, diagram, text passage, timeline, or working surface.
- Put controls next to the thing they change and results next to the evidence that explains them. Avoid repeated journeys between a distant input, formula panel, and result card.
- Keep one current learning task in focus. Sequential stages are useful when students need to predict, act, and check; do not introduce extra navigation for a task that already fits clearly.
- Prefer one shared surface with spacing and type hierarchy over nested containers. Use a border when it communicates a real group, state, or comparison.
- Separate the learning object from its surrounding wrapper when judging scale. Enlarge the actual diagram/model/question, not only its panel. As a starting target for a projected manipulation activity, allocate at least half the usable activity area to the central object; adjust when a paired comparison or response field is essential. This is a composition target, not an excuse to enlarge irrelevant empty space.
- On a projected activity, the question, important values, controls, and result should be visible together at the intended presentation size. Move detail or split into meaningful stages before shrinking everything to fit.
- Derive typography from viewing distance and content. Korean glyph readability matters more than novelty. A readable system or existing font is acceptable; serif headings, dark themes, and multiple font families are not requirements.

## 3. Design one observable interaction

Write the causal chain before implementing motion:

**Learner action → domain state changes → visible evidence → interpretation or next action.**

- Use a real change in the learning object: repartition a bar, regroup equal units, rotate a model, highlight corresponding terms, move a point, or reveal an answer against a prediction.
- Link all related representations to the same state. Numbers, labels, diagram proportions, and grading must agree after every change.
- Use direct manipulation when useful, with an equivalent keyboard/touch control. Do not require hover or dragging as the only way to learn or operate the material.
- Keep input responsive. Short transitions may clarify redistribution or correspondence; they must not delay every change or obscure exact values. Explain longer step-through animations with pause/replay or teacher control when needed.
- Show final values immediately with reduced motion. Essential information must remain available when animations fail or are disabled.
- Avoid decorative pulse loops, ambient moving backgrounds, scroll reveals of required instructions, and confetti as the main evidence of improvement. Sound and celebration are optional lesson choices, not default additions.
- If no meaningful interaction fits the task, use a strong static composition. Do not add a slider just to make the page move.

For task-specific ideas and boundaries, read the lesson patterns included below. Use the relevant example, not the whole catalogue.

## 4. Apply the visual system last

Reuse existing useful tokens, components, fonts, and dependencies. Choose a consistent, limited accent vocabulary to communicate roles. Maintain those roles across text, controls, and visual models; also label them so colour is not the only cue.

Keep adequate contrast, readable input labels, visible keyboard focus, and sensible touch targets. Do not hide overflow to disguise a layout defect. Simplification does not remove error handling, accessibility, or recovery from invalid input.

Use a light or dark treatment according to the actual setting and existing product. Do not force cream paper, hard offset shadows, English eyebrow labels, playful badges, or a theme catalogue onto every lesson. Avoid fake browser/device chrome and fabricated student results or success metrics.

Prefer the project's current implementation tools. Native HTML/CSS, Canvas, or SVG are valid for actual instructional representations. Photographs and screenshots must be real sources, not approximate redraws. Add a library only when an actual requirement warrants it.

## 5. Verify the change against the lesson

- Capture the relevant original screen before editing. Compare the same viewport, task, input values, and reveal state afterwards. Also inspect each version's actual initial screen if the redesign changes the entry point. Do not manufacture a worse “before,” or compare a broken first screen against a different completed activity.
- For dense manipulation screens, record the original and revised **visible nonessential explanatory text** and **independent explanatory panels**, using the same task/state and viewport. Count rendered copy, not source code bytes, class names, or comments. Panel counts describe separate explanation groups, not arbitrary DOM `div` counts. Keep the essential task conditions out of the deletion target; name that boundary. Check the reduction goals in the application contract, and do not claim a percentage you did not measure.
- Confirm where required explanation and each existing activity can still be reached. Merely hiding everything, deleting functionality, or leaving the main model unchanged in a larger empty container fails the redesign.
- Verify the main path in a browser: enter the activity, change the relevant input, observe all linked representations, check/reset, and revisit if the task has stages. Confirm keyboard/touch equivalents for the controls used.
- For projected work, use the real presentation size when known; otherwise use a representative desktop viewport such as 1280×720. Check a narrow viewport when student phones/tablets are in scope. Reset temporary viewport overrides when finished.
- Validate the subject relationship, not only the screenshot. Check totals, proportional lengths, units, accepted answers, and meaningful edge cases. Reuse the existing grader; do not rewrite lesson logic just for styling. Report a discovered content error and repair it only within the user's scope.
- Render formulas readably. Do not ship raw `$...$`, `\\frac`, or `\\times` strings as visible equations. Use existing supported math rendering or appropriately accessible text/HTML for simple expressions.
- Check normal and reduced-motion behaviour. State any untested boundaries rather than claiming classroom readiness from screenshots alone.

Before handoff, answer these questions internally:

1. Can the learner identify the current task without reading an introduction?
2. Does the learning object dominate rather than decorative containers?
3. Is the visual consequence of the action obvious and correct?
4. Has required information remained available without crowding the current activity?
5. Which explanatory regions were merged, moved, or removed, and which learning object actually grew?
6. If the new screen keeps the old card arrangement, is there an explicit task-based reason? “Preserve the existing design” is not a reason when the user asked to simplify that arrangement.

Fix an unsatisfied question that matters to the brief before adding visual polish. If text density and arrangement remain essentially the same, do another structural pass before handoff. No fabricated scores or automatic “all passed” stamps. When browser verification is unavailable, distinguish code changes from observed visual improvement.

## Handoff

Lead with the working result and the most meaningful change. Give a short verification summary and material remaining limits. For a substantial simplification, identify the actual removed/merged/moved groups and any measured reduction in one short sentence. Do not list cosmetic edits as evidence of structural improvement. Keep implementation terminology, source-skill branding, audit checklists, and claims about the designer out of the student-facing UI.

Creating this skill does not itself redesign any supplied app. On each actual use, judge the rendered result; revise a rule only when the observed outcome supports the revision.

## Fork provenance

Adapted from the local `hallmark` skill, version 1.1.0, inspected 2026-10-16. This is an independent, self-contained classroom workflow; the original skill is not modified or required at runtime. Retained ideas: deliberate hierarchy, specific copy, consistent visual language, purposeful feedback, and reduced-motion support. Replaced defaults: theme selection before content, marketing-page archetypes, decorative enrichment, and automatic theme/token exports unrelated to the requested change. Future upstream changes require deliberate review rather than blind replacement.


---

# Lesson patterns

Read only the pattern relevant to the lesson. These are examples of spatial and interaction choices, not required features or a fixed template. Use the user's supplied subject range and language.

## Ratio and proportional distribution

**Task:** Change a ratio, predict how much each person receives, and check the result.

- Keep the total and ratio beside one large partitioned bar or equal-unit model. Show person labels and quantities in that same area.
- Use a short prompt such as “20개를 2 : 3으로 나누면?” and controls with clear labels. A tutorial paragraph, “core principles” card, reward counter, and glossary do not all belong above the model.
- If prediction is part of the brief, preserve an unanswered state. Reveal quantities and a concise calculation after the learner commits a prediction. Otherwise, immediate linked feedback can serve exploration better.
- Animate the partition or regrouping while keeping the total constant. Avoid counting numbers from zero independently of the real state.
- Mathematically verify `shareA + shareB = total` and `shareA : shareB = a : b` within the activity's numeric representation. Do not round indivisible objects into a different ratio. Choose divisible examples when the task requires whole objects, or use exact fractions/continuous quantities when the lesson allows them.
- Handle zero denominators and invalid/unsupported inputs explicitly. Do not silently replace a learner's zero with one through `value || 1`.

**Useful structural change:** long concept introduction + formula card + separate input/result cards → short question + large common model + adjacent controls, with explanation available when needed.

## Stacking blocks and spatial reasoning

**Task:** Manipulate or inspect a block arrangement and connect it to a view/count.

- Make the model large enough to see cubes, occlusion, and orientation. Put rotation/build controls beside it.
- Preserve the front-direction reference and any textbook condition necessary to answer the question.
- For a correspondence activity, show the relevant plan/view alongside the model. A “one focus” rule must not hide the second representation students need to compare.
- Keep an answer concealed while students predict if the task requires prediction. Reveal the answer with the evidence, not just a success badge.
- Use the actual model and answer rules. Do not replace a functioning 3D activity with an attractive static illustration.

## Class management or teacher dashboards

**Task:** Identify the current class state and act on it.

- Prioritize the teacher's actual decision: e.g. who needs checking, which proposal is pending, or which submissions changed.
- Keep names, statuses, and relevant actions aligned in a legible list/table when that is more efficient than cards. Do not convert every row into a full-screen activity.
- Use motion to locate a changed item or explain a transition; preserve focus and selection. Do not animate financial balances or student records merely for spectacle.
- Preserve real permissions, privacy, validation, and persistence. Use clearly identified fictional data for an authorized workshop demo.

## Read-only materials and explanations

**Task:** Read, compare, or follow a worked explanation.

- Use readable prose when reading is itself the activity. Do not compress a text passage or argument until its meaning disappears.
- Emphasize the relevant comparison or step. A teacher-controlled reveal can support a sequence; a stable page may be better for independent reading.
- Keep necessary conditions, evidence, and source wording intact when the user requires it. Hide only secondary detail, with a clear route back to it.
- Do not invent an interaction or elaborate animation to satisfy a visual style.

## Regression case: a cosmetic pass on the dark ratio draft

An observed revision kept three concept cards and two glossary panels in their original arrangement, retained small explanatory text, renamed the card CSS class, added “Hallmark Concept Cards / Principle 01” labels, and changed the visualizer's initial numbers. This is a **failed structural simplification**, even when the HTML differs and hover effects were added.

For a substantial redesign of that manipulation lesson:

- Start at a relevant short question with the working quantity model and adjacent controls. Do not retain the concept-card wall as the default entry screen simply because the source opens there.
- Consolidate the three concept explanations and two vocabulary panels into a purposeful secondary reference. Remove duplicate introductions. Keep required terms available; practice and grading remain reachable and functional.
- Increase the size of the actual model and its important values; verify that students can see the change from the intended viewing distance.
- Compare the same ratio task and values as well as the old/new default screens. Check text/panel reduction and required-content access before calling the redesign complete.

The exact arrangement depends on the supplied lesson. These steps describe what constitutes a meaningful change for this regression case, not a universal instruction to delete concept teaching or reading activities.
