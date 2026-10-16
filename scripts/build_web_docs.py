"""Build self-contained GitHub and web entry points from the skill sources."""

import argparse
from pathlib import Path


def render_documents(root: Path) -> dict[str, str]:
    skill = (root / "SKILL.md").read_text(encoding="utf-8")
    body = skill.split("---", 2)[2].lstrip()
    body = body.removeprefix("# Hallmark Classroom\n\n")
    references = (
        ("creation workflow", "creation-workflow.md", "새 제작 사례", "creation-workflow"),
        ("lesson patterns", "lesson-patterns.md", "전후 편집 사례", "lesson-patterns"),
    )
    sections = []
    for label, filename, title, anchor in references:
        body = body.replace(
            f"[{label}](references/{filename})", f"[{title}](#{anchor})"
        )
        sections.append((root / "references" / filename).read_text(encoding="utf-8"))
    instructions = "\n\n---\n\n".join([body, *sections])
    entry = """# Hallmark Classroom

**주제와 한 줄 요청으로 조작형 수업 자료를 만듭니다. 기존 HTML을 첨부하면 디자인과 수업 기능을 살리며 정리합니다.**

이 README에 실행 지침·새 제작 사례·전후 편집 예시가 모두 들어 있습니다. AI는 이 문서를 읽고 수업 구성부터 구현·확인·수정까지 진행합니다. 다른 스킬을 설치하지 않아도 됩니다. 사용자의 구체적인 요구를 우선합니다.

새 수업 자료 만들기:

```text
https://github.com/Jun268-96/hallmark-classroom 스킬로 비례식과 비례배분 수업 자료 만들어줘. 사이트로.
```

기존 자료를 첨부한 뒤 정리하기:

```text
https://github.com/Jun268-96/hallmark-classroom 이걸로 다시 수정
```

기본 결과는 브라우저에서 열 수 있는 완성 HTML입니다. 파일 생성 도구가 없으면 전체 코드를 제공합니다. 링크 읽기가 지원되지 않는 환경에서는 아래 통합 지침을 파일이나 본문으로 전달해야 합니다. 무료 웹의 모델·도구별 결과 품질은 아직 반복 검증하지 않았습니다.

[통합 지침 원문](https://raw.githubusercontent.com/Jun268-96/hallmark-classroom/main/WEB_GUIDE.md) · [설치용 SKILL.md](SKILL.md)

---

"""
    return {
        "README.md": entry + instructions,
        "WEB_GUIDE.md": (
            "# Hallmark Classroom · Complete Web Instructions\n\n"
            "주제와 새 제작 요청 또는 기존 자료와 수정 요청을 받으면 아래 절차로 완성 자료를 제공하세요. "
            "다른 문서를 추가로 열지 않아도 실행할 수 있도록 지침·제작 사례·편집 예시 전체를 포함합니다.\n\n"
            + instructions
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if generated documents are stale")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    documents = render_documents(root)
    if args.check:
        stale = [name for name, text in documents.items()
                 if not (root / name).exists() or (root / name).read_text(encoding="utf-8") != text]
        if stale:
            parser.exit(1, "Stale web documents: " + ", ".join(stale) + "\n")
        print("Web documents match the skill sources.")
    else:
        for name, text in documents.items():
            (root / name).write_text(text, encoding="utf-8")
            print(f"Built {name}")


if __name__ == "__main__":
    main()
