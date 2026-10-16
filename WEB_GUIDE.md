# Hallmark Classroom · Web Reference

This page includes the complete classroom design instructions and lesson patterns so a web-based assistant can read one document. Follow the user’s task and constraints when applying them.

# Hallmark Classroom

A classroom-focused fork of the local Hallmark skill. Keep its intentional hierarchy, readable typography, restrained visual language, and purposeful feedback. Replace its theme-first page workflow with **learning action → information reduction → spatial composition → visible consequence → styling**.

The finished material should let a student see what to do and see what changed. A palette swap, thicker borders, or more animated cards does not satisfy a request for a substantial redesign.

## Scope and starting point

- Read the existing material and relevant lesson requirements before changing it. Identify the learner, the task, the device, and the mathematical or subject relationship the interface must convey. Infer settled details from the conversation; ask only when a missing answer changes the work.
- Describe the central learner action in one sentence, such as: “Change the ratio and predict each share.” This is an internal design decision, not another introductory card on the page.
- Preserve working routes, data, grading, saved state, and required lesson content. Simplify the current UI in place when possible. Do not replace a working application with a disconnected mockup or silently remove a requested activity.
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

Default to a short question or action sentence instead of an explanatory introduction. Keep essential conditions and vocabulary: shortening must not change the task. Do not replace five text cards with five accordions. Choose the few secondary views the lesson actually needs.

For substantial redesigns, change the visible content hierarchy and spatial structure **before** polishing fonts, borders, or colour. If the proposed before/after still has the same wall of cards, revisit the composition. A narrow colour-only request remains narrow.

## 2. Give the activity the space

- Make the object students manipulate or inspect the visual centre: a quantity model, map, diagram, text passage, timeline, or working surface.
- Put controls next to the thing they change and results next to the evidence that explains them. Avoid repeated journeys between a distant input, formula panel, and result card.
- Keep one current learning task in focus. Sequential stages are useful when students need to predict, act, and check; do not introduce extra navigation for a task that already fits clearly.
- Prefer one shared surface with spacing and type hierarchy over nested containers. Use a border when it communicates a real group, state, or comparison.
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

- Capture the relevant original screen before editing. Compare the same viewport, task, input values, and reveal state afterwards. Do not manufacture a worse “before,” or compare a broken first screen against a different completed activity.
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
5. Does the before/after show a useful change beyond the colour palette?

Fix an unsatisfied question that matters to the brief before adding visual polish. No fabricated scores or automatic “all passed” stamps.

## Handoff

Lead with the working result and the most meaningful change. Give a short verification summary and material remaining limits. Keep implementation terminology, source-skill branding, audit checklists, and claims about the designer out of the student-facing UI.

Creating this skill does not itself redesign any supplied app. On its first real use, judge the rendered result; revise a rule only when the observed outcome supports the revision.

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

## Applying the patterns to the two ratio drafts

The observed cream draft has explanatory introductions and many bordered groups; raw math syntax is visible in formulas. The dark draft has more orderly cards but small, muted supporting text and a concept-heavy first screen. Neither a colour swap nor swapping one card style for another resolves both problems.

For a requested substantial classroom redesign, consider starting directly at the relevant learner task, enlarging its visual evidence and controls, and moving the concept recap to a purposeful secondary view. Preserve the existing practice flow and mathematical content. This observation motivates the workflow; it does not prove a future redesign works before browser verification.
