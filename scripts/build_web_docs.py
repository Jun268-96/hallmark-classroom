"""Build self-contained GitHub and web entry points from the skill sources."""

from pathlib import Path


def render_documents(root: Path) -> dict[str, str]:
    skill = (root / "SKILL.md").read_text(encoding="utf-8")
    body = skill.split("---", 2)[2].lstrip()
    body = body.replace(
        "[lesson patterns](references/lesson-patterns.md)",
        "the lesson patterns included below",
    )
    patterns = (root / "references/lesson-patterns.md").read_text(encoding="utf-8")
    instructions = body + "\n\n---\n\n" + patterns
    entry = """# Hallmark Classroom

**수업 자료를 첨부하고 이 저장소 주소와 “이걸로 수정해줘”만 보내세요.**

이 README는 소개 페이지와 AI 실행 지침을 겸합니다. 아래에 스킬의 전체 본문과 수업별 패턴이 들어 있습니다. 사용자가 이 지침으로 수정을 요청하고 대상 자료를 제공했다면, AI는 추가 프롬프트를 요구하지 말고 아래 기준으로 작업을 시작합니다. 사용자의 더 구체적인 요구와 작업 범위를 우선합니다.

기본 결과: **설명과 카드 구조를 크게 줄이고, 학습 대상을 크게 재배치한 실제 작동 자료.** 색상·문구·아이콘 변경만으로 완료 처리하지 않습니다. 수업 내용·기능·정답 로직은 보존합니다.

```text
https://github.com/Jun268-96/hallmark-classroom 이걸로 다시 수정
```

위 한 줄은 수정할 HTML·앱이 함께 제공됐거나 현재 대화에 있을 때 사용하는 예시입니다. 웹 링크를 읽을 수 없는 환경에서는 지침을 자동으로 가져올 수 없습니다. 읽기 실패를 알리는 것이 지침을 적용한 척하는 것보다 우선합니다.

[통합 지침 원문](https://raw.githubusercontent.com/Jun268-96/hallmark-classroom/main/WEB_GUIDE.md) · [설치용 SKILL.md](SKILL.md)

---

"""
    return {
        "README.md": entry + instructions,
        "WEB_GUIDE.md": (
            "# Hallmark Classroom · Complete Web Instructions\n\n"
            "사용자가 이 지침과 수정할 자료를 제공하면, 짧은 수정 요청도 아래 기본 작업으로 실행하세요. "
            "이 문서에는 필요한 지침과 수업별 패턴 전체가 포함되어 있습니다.\n\n"
            + instructions
        ),
    }


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    for name, text in render_documents(root).items():
        (root / name).write_text(text, encoding="utf-8")
        print(f"Built {name}")


if __name__ == "__main__":
    main()
