# Hallmark Classroom

수업용 웹 자료의 **설명과 배치를 줄이고, 학생의 조작과 결과를 크게 보여주는** 디자인 스킬입니다. 로컬 Hallmark 1.1.0의 원칙을 수업 자료용으로 재구성한 독립 버전입니다.

## 웹 AI에 참고시키기

[통합 지침 읽기](WEB_GUIDE.md) · [원문으로 열기](https://raw.githubusercontent.com/Jun268-96/hallmark-classroom/main/WEB_GUIDE.md)

통합 지침은 스킬 본문과 수업별 패턴을 한 문서에 담았습니다. 링크를 읽을 수 있는 AI에 아래처럼 요청하세요. 링크를 읽지 못하면 문서 내용을 붙여 넣으면 됩니다.

```text
https://raw.githubusercontent.com/Jun268-96/hallmark-classroom/main/WEB_GUIDE.md

이 링크의 Hallmark Classroom 지침을 읽고, 첨부한 수업용 웹앱을 개선해줘.
긴 설명과 중첩된 카드 배치를 줄이고, 학생이 조작하는 대상과 그 결과를 크게 보여줘.
필요한 수업 내용과 기존 기능, 정답 처리 로직은 보존해줘.
```

## 스킬로 사용하기

[SKILL.md](SKILL.md)를 포함한 이 저장소를 `hallmark-classroom` 스킬 폴더로 설치한 뒤 호출합니다.

```text
$hallmark-classroom으로 이 수업 자료를 재구성해줘.
```

우선순위: 학생의 행동 → 정보 간소화 → 배치 → 시각적 피드백 → 스타일.
색상만 바꾸는 대신 실제 정보 구조와 상호작용을 개선하도록 구성했습니다. 결과는 적용 후 실제 화면과 동작으로 확인해야 합니다.
