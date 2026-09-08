# 가치타자 (Value Typing)

> 60초, 쏟아지는 가치의 정답을 타이핑하라!

공공기관 직원 참여형 웹 타자게임. 퀴즈 + 60초 스피드전 + 직원 랭킹.
5개 분야: **혁신경영 · 고객만족경영 · 윤리경영 · 인권경영 · 친환경경영**

**게임 방식**: 문제가 뜨면 헷갈리는 후보 단어들이 화면 전체에 흩뿌려집니다.
문제를 읽고 정답 단어를 찾아 타이핑하면 폭발 + 득점. 문제별 제한시간(낙하영역 상단 바)
안에 못 맞히면 감점 후 다음 문제. 레벨이 오를수록 후보 수가 늘고(7→10→13→16개)
제한시간이 짧아집니다. 전체 60초는 상단 게이지로 크게 표시(20초 노랑·10초 빨강 카운트다운).
세부 값은 `js/config.js` 의 `LEVELS`·`SCATTER` 에서 조정.

빌드 과정 없는 순수 HTML/CSS/JavaScript. GitHub Pages 등 정적 호스팅에서 바로 실행됩니다.

## 실행 방법

### 1) 가장 간단 — 파일 직접 열기
`index.html` 을 브라우저로 엽니다. (한글 IME·게임 모두 동작)

### 2) 로컬 서버 (권장)
```bash
cd 가치타자
python -m http.server 5173
```
브라우저에서 `http://localhost:5173` 접속.

### 3) GitHub Pages 배포 (직원 공유용, 권장)
1. GitHub에 저장소 생성(예: `gachitaja`) → `가치타자` 폴더 안의 파일 전부 업로드
2. **Settings → Pages → Branch: main / root** 저장
3. 1~2분 뒤 `https://<아이디>.github.io/gachitaja/` 접속
4. 내부게시판에 이 주소를 링크(버튼)로 게시
   - ⚠ 게시판 본문에 HTML을 직접 붙여넣지 마세요(스크립트가 제거됨). **링크만** 넣습니다.

### 전 직원 공용 랭킹
개인 랭킹은 기본 동작. 전 직원이 한 랭킹을 공유하려면
**[SETUP_RANKING.md](SETUP_RANKING.md)** 대로 구글시트+Apps Script를 10분 안에 연결하세요.

## 폴더 구조

```
가치타자/
├── index.html
├── css/style.css
├── js/
│   ├── config.js     난이도·점수·등급 등 모든 설정값 (여기 숫자만 바꿔도 튜닝됨)
│   ├── score.js      점수 계산식
│   ├── typing.js     한글 IME 대응 타이핑 엔진 + 단어 정규화
│   ├── effects.js    픽셀 폭발·팝업·사운드(Web Audio 합성)
│   ├── storage.js    기록 저장 / 랭킹 데이터 (로컬 + 구글시트 공용 랭킹)
│   ├── game.js       게임 엔진(타이머·스캐터·판정·콤보)
│   ├── ranking.js    랭킹 화면 UI (마스킹·트로피·나의 순위)
│   └── app.js        화면 전환 & 전체 흐름 (결과 등록 버튼 포함)
├── data/
│   ├── questions.js  문제은행 (5분야 × 20문제 = 100문제)
│   └── departments.js 부서 드롭다운 목록
├── apps-script/Code.gs  공용 랭킹용 Google Apps Script 코드
├── SETUP_RANKING.md     공용 랭킹 연결 절차 (약 10분)
├── QUESTIONS_REVIEW.md  문제은행 자체 검수 기록
└── assets/images, sounds  (선택) 이미지·효과음 교체용
```

## 자주 하는 수정

| 하고 싶은 것 | 고칠 파일 |
|---|---|
| 문제 추가·수정 | `data/questions.js` |
| 부서 목록 변경 | `data/departments.js` |
| 후보 개수 / 문제별 제한시간 / 점수 / 등급 | `js/config.js` (`LEVELS`, `SCORE`, `GRADES`) |
| 전 직원 공용 랭킹 연결 | `js/config.js` 의 `STORAGE.sheetApiUrl` — [SETUP_RANKING.md](SETUP_RANKING.md) 참고 |

## 기록 저장

- `STORAGE.sheetApiUrl` 이 **비어 있으면** → 이 브라우저 안에서만 개인 랭킹
- **채워져 있으면** → 결과 화면 「전체 랭킹에 등록」 버튼 + 전 직원 공용 랭킹(구글시트)
- 프런트엔드 코드에 비밀번호·API Secret·관리자 키를 넣지 않습니다.
  (Apps Script 웹앱 주소는 공개돼도 무방한 값)
