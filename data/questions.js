/* =============================================================
 * 가치타자 — 문제은행 (questions.js)   ★ 게임 엔진과 완전 분리된 데이터 파일
 *
 * ▶ 코딩 지식 없이 이 파일만 고치면 됩니다.
 * ▶ 문제 1개 형식:
 *   {
 *     id: 'ETH-001',            // 고유 ID (INN 혁신 / CS 고객만족 / ETH 윤리 / HR 인권 / ENV 친환경)
 *     category: '윤리경영',      // 반드시 CONFIG.CATEGORIES 중 하나
 *     difficulty: 'EASY',        // 'EASY' | 'NORMAL' | 'HARD'
 *     question: '...?',          // 1문장, 읽는 데 2~4초
 *     answer: '공정',            // 한 단어/핵심어 (2~8자 권장, 가운뎃점·띄어쓰기는 입력 시 무시)
 *     choices: ['공정','친절','혁신','재활용']   // 정답 포함, 헷갈릴 만한 후보 3~5개
 *   }
 *
 * ▶ 문제 추가:  QUESTION_BANK 배열 맨 끝에 { ... } 를 넣으세요.
 * ▶ 문제 삭제:  해당 { ... } 줄을 지우세요.
 * ▶ 문제 수정:  question/answer/choices 문자열만 바꾸세요.
 *
 * ▶ 구성: 5개 분야 × 20문제 = 100문제.  난이도 비율 EASY 30% / NORMAL 50% / HARD 20%.
 *   법령 조문·수치를 외우는 문제는 넣지 않았고, 공공기관 경영가치 개념 중심으로 구성했습니다.
 *   (자체 검수 기록: 같은 폴더 QUESTIONS_REVIEW.md 참고)
 * ============================================================= */
(function (global) {
  'use strict';

  const QUESTION_BANK = [
    /* ================= 혁신경영 (INN) ================= */
    { id: 'INN-001', category: '혁신경영', difficulty: 'EASY',   question: '기존의 방식을 더 낫게 바꾸어 성과를 높이는 활동은?', answer: '업무개선', choices: ['업무개선', '성과평가', '예산절감', '정보공개'] },
    { id: 'INN-002', category: '혁신경영', difficulty: 'EASY',   question: '종이 문서와 수작업을 정보기술 기반으로 바꾸는 흐름은?', answer: '디지털전환', choices: ['디지털전환', '자원순환', '조직개편', '문서보관'] },
    { id: 'INN-003', category: '혁신경영', difficulty: 'EASY',   question: '여러 부서가 함께 힘을 모아 일하는 방식은?', answer: '협업', choices: ['협업', '경쟁', '위임', '결재'] },
    { id: 'INN-004', category: '혁신경영', difficulty: 'EASY',   question: '시키지 않아도 공익을 위해 스스로 나서서 처리하는 자세는?', answer: '적극행정', choices: ['적극행정', '소극행정', '관행답습', '책임전가'] },
    { id: 'INN-005', category: '혁신경영', difficulty: 'EASY',   question: '같은 일을 더 적은 시간과 자원으로 처리하는 정도는?', answer: '업무효율', choices: ['업무효율', '초과근무', '형식주의', '성과급'] },
    { id: 'INN-006', category: '혁신경영', difficulty: 'EASY',   question: '반복되는 단순 작업을 시스템이 대신 처리하게 만드는 것은?', answer: '자동화', choices: ['자동화', '외주화', '문서화', '분업화'] },
    { id: 'INN-007', category: '혁신경영', difficulty: 'NORMAL', question: '감이나 경험이 아니라 수치와 통계를 근거로 판단하는 것은?', answer: '데이터활용', choices: ['데이터활용', '직관판단', '다수결', '연공서열'] },
    { id: 'INN-008', category: '혁신경영', difficulty: 'NORMAL', question: '남과 다른 새로운 생각을 떠올리고 시도하는 능력은?', answer: '창의성', choices: ['창의성', '전문성', '성실성', '정확성'] },
    { id: 'INN-009', category: '혁신경영', difficulty: 'NORMAL', question: '조직이 바뀔 때 구성원의 혼란을 줄이며 이끄는 관리는?', answer: '변화관리', choices: ['변화관리', '위기관리', '성과관리', '자산관리'] },
    { id: 'INN-010', category: '혁신경영', difficulty: 'NORMAL', question: '국민이 불편을 겪는 낡은 규정을 고치거나 없애는 일은?', answer: '규제개선', choices: ['규제개선', '예산편성', '조직개편', '감사강화'] },
    { id: 'INN-011', category: '혁신경영', difficulty: 'NORMAL', question: '앞선 다른 기관의 사례를 배워 우리 업무에 적용하는 것은?', answer: '벤치마킹', choices: ['벤치마킹', '아웃소싱', '모니터링', '스크리닝'] },
    { id: 'INN-012', category: '혁신경영', difficulty: 'NORMAL', question: '여러 사람의 지식과 의견을 모아 더 나은 답을 찾는 것은?', answer: '집단지성', choices: ['집단지성', '다수결', '상명하복', '여론몰이'] },
    { id: 'INN-013', category: '혁신경영', difficulty: 'NORMAL', question: '새 제도를 일부 대상에 먼저 적용해 효과를 확인하는 사업은?', answer: '시범사업', choices: ['시범사업', '정규사업', '보조사업', '수탁사업'] },
    { id: 'INN-014', category: '혁신경영', difficulty: 'NORMAL', question: '직원이 개선 아이디어를 자유롭게 낼 수 있게 만든 제도는?', answer: '제안제도', choices: ['제안제도', '결재제도', '포상제도', '징계제도'] },
    { id: 'INN-015', category: '혁신경영', difficulty: 'NORMAL', question: '서로 다른 기술이나 분야를 합쳐 새로운 가치를 만드는 것은?', answer: '융합', choices: ['융합', '분업', '전문화', '표준화'] },
    { id: 'INN-016', category: '혁신경영', difficulty: 'NORMAL', question: '시간과 장소에 얽매이지 않고 유연하게 일하는 방식은?', answer: '스마트워크', choices: ['스마트워크', '교대근무', '연장근무', '파견근무'] },
    { id: 'INN-017', category: '혁신경영', difficulty: 'HARD',   question: "조직이나 규정이 아니라 '일하는 절차 자체'를 다시 설계하는 것은?", answer: '프로세스개선', choices: ['프로세스개선', '조직개편', '규제개선', '인사이동'] },
    { id: 'INN-018', category: '혁신경영', difficulty: 'HARD',   question: '제공하는 서비스의 내용과 전달 방식을 새롭게 바꾸는 것은?', answer: '서비스혁신', choices: ['서비스혁신', '조직혁신', '재무개선', '홍보강화'] },
    { id: 'INN-019', category: '혁신경영', difficulty: 'HARD',   question: '실패를 탓하지 않고 새로운 도전을 장려하는 조직 분위기는?', answer: '혁신문화', choices: ['혁신문화', '서열문화', '온정주의', '성과주의'] },
    { id: 'INN-020', category: '혁신경영', difficulty: 'HARD',   question: '목표와 지표를 정해 달성 정도를 점검하고 개선하는 것은?', answer: '성과관리', choices: ['성과관리', '일정관리', '위험관리', '문서관리'] },

    /* ================= 고객만족경영 (CS) ================= */
    { id: 'CS-001', category: '고객만족경영', difficulty: 'EASY',   question: '모든 판단의 기준을 이용자에게 두는 경영 방향은?', answer: '고객중심', choices: ['고객중심', '실적중심', '절차중심', '상급자중심'] },
    { id: 'CS-002', category: '고객만족경영', difficulty: 'EASY',   question: '방문한 이용자를 밝고 정중한 태도로 맞이하는 것은?', answer: '친절', choices: ['친절', '신속', '정확', '공정'] },
    { id: 'CS-003', category: '고객만족경영', difficulty: 'EASY',   question: '접수된 불편이나 요구에 답하고 처리하는 일은?', answer: '민원응대', choices: ['민원응대', '내부보고', '예산집행', '문서정리'] },
    { id: 'CS-004', category: '고객만족경영', difficulty: 'EASY',   question: '고객의 의견을 듣고 서비스 개선에 반영하는 활동은?', answer: '고객의견수렴', choices: ['고객의견수렴', '탄소중립', '상호존중', '업무혁신'] },
    { id: 'CS-005', category: '고객만족경영', difficulty: 'EASY',   question: '노약자와 장애인도 시설을 쉽게 이용하도록 만드는 것은?', answer: '접근성', choices: ['접근성', '보안성', '수익성', '전문성'] },
    { id: 'CS-006', category: '고객만족경영', difficulty: 'EASY',   question: '이용자에게 필요한 안내와 자료를 미리 알려 주는 것은?', answer: '정보제공', choices: ['정보제공', '정보통제', '실적홍보', '내부공유'] },
    { id: 'CS-007', category: '고객만족경영', difficulty: 'NORMAL', question: '서비스가 얼마나 만족스러운지 주기적으로 확인하는 조사는?', answer: '만족도조사', choices: ['만족도조사', '감사점검', '수요예측', '실태단속'] },
    { id: 'CS-008', category: '고객만족경영', difficulty: 'NORMAL', question: '불만을 제기한 이용자의 입장을 먼저 이해하고 헤아리는 태도는?', answer: '공감', choices: ['공감', '해명', '훈계', '회피'] },
    { id: 'CS-009', category: '고객만족경영', difficulty: 'NORMAL', question: '어려운 내용을 이용자가 이해하기 쉽게 풀어 설명하는 것은?', answer: '눈높이설명', choices: ['눈높이설명', '전문용어', '형식답변', '일방통보'] },
    { id: 'CS-010', category: '고객만족경영', difficulty: 'NORMAL', question: '민원을 미루지 않고 되도록 빨리 마무리하는 것은?', answer: '신속처리', choices: ['신속처리', '선례답습', '부서이송', '장기보류'] },
    { id: 'CS-011', category: '고객만족경영', difficulty: 'NORMAL', question: '서비스 제공이 끝난 뒤에도 문제가 없는지 살피는 것은?', answer: '사후관리', choices: ['사후관리', '사전점검', '현장감독', '실적정리'] },
    { id: 'CS-012', category: '고객만족경영', difficulty: 'NORMAL', question: '이용자가 손해를 입었을 때 이를 바로잡아 주는 절차는?', answer: '피해구제', choices: ['피해구제', '민원종결', '손해보험', '예산삭감'] },
    { id: 'CS-013', category: '고객만족경영', difficulty: 'NORMAL', question: '이용자와 자주 대화하며 요구와 불만을 파악하는 것은?', answer: '고객소통', choices: ['고객소통', '내부회의', '실적보고', '일방홍보'] },
    { id: 'CS-014', category: '고객만족경영', difficulty: 'NORMAL', question: '제공할 서비스의 기준을 정해 대외적으로 약속하는 문서는?', answer: '서비스헌장', choices: ['서비스헌장', '취업규칙', '업무분장', '운영일지'] },
    { id: 'CS-015', category: '고객만족경영', difficulty: 'NORMAL', question: '이용자가 시설을 편하게 쓰도록 예약 절차를 간편하게 만드는 것은?', answer: '예약편의', choices: ['예약편의', '요금인상', '이용제한', '현장대기'] },
    { id: 'CS-016', category: '고객만족경영', difficulty: 'NORMAL', question: '이용자가 서비스 전 과정에서 느끼는 전체적인 경험은?', answer: '고객경험', choices: ['고객경험', '직원만족', '서비스원가', '민원건수'] },
    { id: 'CS-017', category: '고객만족경영', difficulty: 'HARD',   question: '단순한 만족을 넘어 이용자의 권리와 이익 자체를 지키는 것은?', answer: '고객권익', choices: ['고객권익', '고객친절', '고객유치', '고객관리'] },
    { id: 'CS-018', category: '고객만족경영', difficulty: 'HARD',   question: '담당자의 말투·표정·자세 등 대하는 자세를 관리하는 것은?', answer: '응대태도', choices: ['응대태도', '근무평정', '복장규정', '업무숙련'] },
    { id: 'CS-019', category: '고객만족경영', difficulty: 'HARD',   question: '제기된 불만의 원인을 찾아 해결하고 재발을 막는 일은?', answer: '불만처리', choices: ['불만처리', '불만접수', '여론수렴', '실적정리'] },
    { id: 'CS-020', category: '고객만족경영', difficulty: 'HARD',   question: '제공하는 서비스의 정확성과 일관성 수준을 뜻하는 말은?', answer: '서비스품질', choices: ['서비스품질', '서비스요금', '서비스범위', '서비스속도'] },

    /* ================= 윤리경영 (ETH) ================= */
    { id: 'ETH-001', category: '윤리경영', difficulty: 'EASY',   question: '업무를 처리할 때 특정 사람에게 유리하거나 불리하지 않게 대하는 가치는?', answer: '공정', choices: ['공정', '친절', '혁신', '재활용'] },
    { id: 'ETH-002', category: '윤리경영', difficulty: 'EASY',   question: '직무와 관련해 금전이나 선물을 받지 않는 깨끗한 자세는?', answer: '청렴', choices: ['청렴', '겸손', '근면', '협조'] },
    { id: 'ETH-003', category: '윤리경영', difficulty: 'EASY',   question: '직무 관련자에게서 받는 식사 접대나 유흥 대접을 뜻하는 말은?', answer: '향응', choices: ['향응', '후원', '봉사', '격려'] },
    { id: 'ETH-004', category: '윤리경영', difficulty: 'EASY',   question: '자신의 사적인 이익과 공적인 업무가 서로 부딪치는 상황은?', answer: '이해충돌', choices: ['이해충돌', '의견대립', '부서갈등', '업무과중'] },
    { id: 'ETH-005', category: '윤리경영', difficulty: 'EASY',   question: '정상적 절차를 벗어나 일을 처리해 달라고 부탁하는 것은?', answer: '부정청탁', choices: ['부정청탁', '정식민원', '정보공개', '업무협조'] },
    { id: 'ETH-006', category: '윤리경영', difficulty: 'EASY',   question: '일 처리 과정을 숨기지 않고 드러내 보이는 것은?', answer: '투명성', choices: ['투명성', '신속성', '전문성', '적극성'] },
    { id: 'ETH-007', category: '윤리경영', difficulty: 'NORMAL', question: '담당 업무와 관련해 자신이나 가족의 이익이 걸린 관계는?', answer: '사적이해관계', choices: ['사적이해관계', '공적업무관계', '상하관계', '협력관계'] },
    { id: 'ETH-008', category: '윤리경영', difficulty: 'NORMAL', question: '이해충돌이 있는 직원을 해당 업무에서 빼내 맡기지 않는 것은?', answer: '직무배제', choices: ['직무배제', '직무대리', '직무분장', '직무연수'] },
    { id: 'ETH-009', category: '윤리경영', difficulty: 'NORMAL', question: '부패 행위를 알게 되었을 때 감사부서 등에 알리는 것은?', answer: '신고', choices: ['신고', '은폐', '방관', '동조'] },
    { id: 'ETH-010', category: '윤리경영', difficulty: 'NORMAL', question: '맡은 일의 결과에 대해 끝까지 책임지는 자세는?', answer: '책임성', choices: ['책임성', '자율성', '창의성', '효율성'] },
    { id: 'ETH-011', category: '윤리경영', difficulty: 'NORMAL', question: '허가 없이 다른 직업이나 영리 활동을 하지 않는 것은?', answer: '겸직금지', choices: ['겸직금지', '정시출근', '복무규율', '연가사용'] },
    { id: 'ETH-012', category: '윤리경영', difficulty: 'NORMAL', question: '업무상 알게 된 정보를 외부에 함부로 알리지 않는 의무는?', answer: '비밀유지', choices: ['비밀유지', '정보공개', '실적보고', '자료제출'] },
    { id: 'ETH-013', category: '윤리경영', difficulty: 'NORMAL', question: '사사로움 없이 원칙과 절차대로 일을 처리하는 것은?', answer: '공정처리', choices: ['공정처리', '편의제공', '관행처리', '재량남용'] },
    { id: 'ETH-014', category: '윤리경영', difficulty: 'NORMAL', question: '공직자가 직무를 수행할 때 지켜야 할 행동의 기준은?', answer: '직무윤리', choices: ['직무윤리', '근무성적', '업무분장', '조직규범'] },
    { id: 'ETH-015', category: '윤리경영', difficulty: 'NORMAL', question: '부패나 오류를 미리 막기 위한 기관 내부의 점검·견제 장치는?', answer: '내부통제', choices: ['내부통제', '외부감사', '상호협력', '성과평가'] },
    { id: 'ETH-016', category: '윤리경영', difficulty: 'NORMAL', question: '직무와 관련해 돈이나 물건을 주고받는 행위는?', answer: '금품수수', choices: ['금품수수', '실비정산', '예산집행', '기부접수'] },
    { id: 'ETH-017', category: '윤리경영', difficulty: 'HARD',   question: '사적 이해관계자가 업무 상대일 때 미리 알리도록 한 제도는?', answer: '이해충돌방지', choices: ['이해충돌방지', '부패신고', '청렴서약', '정보공개'] },
    { id: 'ETH-018', category: '윤리경영', difficulty: 'HARD',   question: '부패가 없는 상태를 넘어 이를 적극적으로 없애려는 활동 전반은?', answer: '반부패', choices: ['반부패', '준법지원', '윤리교육', '감찰조사'] },
    { id: 'ETH-019', category: '윤리경영', difficulty: 'HARD',   question: '상급자의 위법한 지시를 그대로 따르지 않고 문제를 제기하는 것은?', answer: '이의제기', choices: ['이의제기', '묵시동의', '상명하복', '내부결재'] },
    { id: 'ETH-020', category: '윤리경영', difficulty: 'HARD',   question: '이해관계 있는 업체와의 계약 업무에서 담당자가 취할 첫 조치는?', answer: '회피', choices: ['회피', '강행', '묵인', '사후보고'] },

    /* ================= 인권경영 (HR) ================= */
    { id: 'HR-001', category: '인권경영', difficulty: 'EASY',   question: '사람은 누구나 존엄하다는 생각을 바탕에 두는 가치는?', answer: '인권존중', choices: ['인권존중', '성과우선', '효율우선', '서열존중'] },
    { id: 'HR-002', category: '인권경영', difficulty: 'EASY',   question: '성별·나이·출신 등을 이유로 다르게 대우하지 않는 것은?', answer: '차별금지', choices: ['차별금지', '실적평가', '연공서열', '정원관리'] },
    { id: 'HR-003', category: '인권경영', difficulty: 'EASY',   question: '지위를 이용해 상대에게 부당한 요구나 괴롭힘을 하는 행위는?', answer: '갑질', choices: ['갑질', '협상', '지도', '위임'] },
    { id: 'HR-004', category: '인권경영', difficulty: 'EASY',   question: '서로의 인격과 입장을 인정하고 배려하는 태도는?', answer: '상호존중', choices: ['상호존중', '무한경쟁', '상명하복', '각자도생'] },
    { id: 'HR-005', category: '인권경영', difficulty: 'EASY',   question: '이름·주민번호·연락처처럼 특정인을 알아볼 수 있는 자료를 안전하게 지키는 것은?', answer: '개인정보보호', choices: ['개인정보보호', '정보공개', '자료공유', '실적관리'] },
    { id: 'HR-006', category: '인권경영', difficulty: 'EASY',   question: '나이·성별·문화가 다른 구성원을 함께 인정하는 것은?', answer: '다양성', choices: ['다양성', '획일성', '폐쇄성', '서열성'] },
    { id: 'HR-007', category: '인권경영', difficulty: 'NORMAL', question: '같은 일터에서 우위를 이용해 신체적·정신적 고통을 주는 행위는?', answer: '직장내괴롭힘', choices: ['직장내괴롭힘', '업무지시', '성과면담', '인사평가'] },
    { id: 'HR-008', category: '인권경영', difficulty: 'NORMAL', question: '원치 않는 성적인 말이나 행동으로 상대에게 불쾌감을 주는 것은?', answer: '성희롱', choices: ['성희롱', '농담', '칭찬', '조언'] },
    { id: 'HR-009', category: '인권경영', difficulty: 'NORMAL', question: '인권을 침해당한 사람이 더 다치지 않도록 지켜 주는 것은?', answer: '피해자보호', choices: ['피해자보호', '가해자징계', '사건종결', '여론관리'] },
    { id: 'HR-010', category: '인권경영', difficulty: 'NORMAL', question: '신고했다는 이유로 불이익을 주거나 소문내는 행위를 막는 것은?', answer: '2차가해방지', choices: ['2차가해방지', '사실확인', '화해권고', '정보공유'] },
    { id: 'HR-011', category: '인권경영', difficulty: 'NORMAL', question: '직원이 겪는 어려움이나 불만을 듣고 해결해 주는 절차는?', answer: '고충처리', choices: ['고충처리', '근무평정', '상벌관리', '복무점검'] },
    { id: 'HR-012', category: '인권경영', difficulty: 'NORMAL', question: '임신·출산한 직원의 건강과 권리를 지켜 주는 것은?', answer: '모성보호', choices: ['모성보호', '연차촉진', '정원관리', '성과배분'] },
    { id: 'HR-013', category: '인권경영', difficulty: 'NORMAL', question: '장애인이 시설과 서비스를 불편 없이 이용하도록 돕는 것은?', answer: '장애인편의', choices: ['장애인편의', '우선채용', '봉사활동', '시설점검'] },
    { id: 'HR-014', category: '인권경영', difficulty: 'NORMAL', question: '다른 사람의 인권 문제를 민감하게 알아차리는 능력은?', answer: '인권감수성', choices: ['인권감수성', '위기의식', '준법정신', '경쟁의식'] },
    { id: 'HR-015', category: '인권경영', difficulty: 'NORMAL', question: '협력업체나 파견 근로자의 권리까지 함께 존중하는 것은?', answer: '노동인권', choices: ['노동인권', '노사교섭', '임금협상', '성과배분'] },
    { id: 'HR-016', category: '인권경영', difficulty: 'NORMAL', question: '어려운 처지에 있는 사람을 먼저 헤아려 돕는 자세는?', answer: '약자배려', choices: ['약자배려', '성과경쟁', '강자우대', '형평무시'] },
    { id: 'HR-017', category: '인권경영', difficulty: 'HARD',   question: '정책이나 사업을 시행하기 전에 인권에 미칠 영향을 미리 검토하는 것은?', answer: '인권영향평가', choices: ['인권영향평가', '만족도조사', '규제심사', '성과평가'] },
    { id: 'HR-018', category: '인권경영', difficulty: 'HARD',   question: '상사의 지시가 괴롭힘이 아니라고 보려면 그 지시에 무엇이 있어야 하나?', answer: '업무관련성', choices: ['업무관련성', '개인감정', '인격모독', '사적심부름'] },
    { id: 'HR-019', category: '인권경영', difficulty: 'HARD',   question: '과거에 불리했던 집단을 실질적 평등을 위해 앞장서 지원하는 조치는?', answer: '적극적우대', choices: ['적극적우대', '역차별', '성과주의', '정원동결'] },
    { id: 'HR-020', category: '인권경영', difficulty: 'HARD',   question: '개인정보는 꼭 필요한 범위에서만 모아야 한다는 원칙은?', answer: '최소수집', choices: ['최소수집', '전면수집', '자유열람', '무기한보관'] },

    /* ================= 친환경경영 (ENV) ================= */
    { id: 'ENV-001', category: '친환경경영', difficulty: 'EASY',   question: '쓰고 버린 물건을 다시 쓸 수 있게 되살리는 것은?', answer: '재활용', choices: ['재활용', '매립', '소각', '방치'] },
    { id: 'ENV-002', category: '친환경경영', difficulty: 'EASY',   question: '전기와 연료를 꼭 필요한 만큼만 쓰는 것은?', answer: '에너지절약', choices: ['에너지절약', '설비증설', '야간가동', '냉난방강화'] },
    { id: 'ENV-003', category: '친환경경영', difficulty: 'EASY',   question: '종이컵 대신 여러 번 쓰는 개인 컵을 쓰는 습관은?', answer: '텀블러사용', choices: ['텀블러사용', '일회용선호', '배달주문', '종이낭비'] },
    { id: 'ENV-004', category: '친환경경영', difficulty: 'EASY',   question: '페트·캔·종이를 종류별로 나누어 버리는 것은?', answer: '분리배출', choices: ['분리배출', '혼합배출', '무단투기', '매립처리'] },
    { id: 'ENV-005', category: '친환경경영', difficulty: 'EASY',   question: '환경에 해를 덜 끼치는 성질을 뜻하는 말은?', answer: '친환경', choices: ['친환경', '고효율', '저비용', '대용량'] },
    { id: 'ENV-006', category: '친환경경영', difficulty: 'EASY',   question: '자가용 대신 버스나 지하철을 타는 것은?', answer: '대중교통이용', choices: ['대중교통이용', '자가용출퇴근', '단독운행', '항공이용'] },
    { id: 'ENV-007', category: '친환경경영', difficulty: 'NORMAL', question: '배출한 만큼 흡수·상쇄해 실질 배출량을 0으로 만드는 개념은?', answer: '탄소중립', choices: ['탄소중립', '에너지절약', '자원순환', '녹색구매'] },
    { id: 'ENV-008', category: '친환경경영', difficulty: 'NORMAL', question: '자원을 버리지 않고 다시 원료로 되돌려 쓰는 경제 방식은?', answer: '자원순환', choices: ['자원순환', '대량생산', '일회소비', '자원개발'] },
    { id: 'ENV-009', category: '친환경경영', difficulty: 'NORMAL', question: '물건을 살 때 환경 표지가 붙은 제품을 우선 고르는 것은?', answer: '녹색구매', choices: ['녹색구매', '최저가구매', '대량구매', '수의계약'] },
    { id: 'ENV-010', category: '친환경경영', difficulty: 'NORMAL', question: '지구를 데우는 이산화탄소·메탄 같은 기체를 통틀어 이르는 말은?', answer: '온실가스', choices: ['온실가스', '미세먼지', '오존층', '방사선'] },
    { id: 'ENV-011', category: '친환경경영', difficulty: 'NORMAL', question: '인쇄물을 줄이고 한 번 쓴 종이의 뒷면을 다시 쓰는 것은?', answer: '이면지사용', choices: ['이면지사용', '컬러출력', '대량인쇄', '코팅제본'] },
    { id: 'ENV-012', category: '친환경경영', difficulty: 'NORMAL', question: '태양광·풍력처럼 고갈되지 않고 다시 쓰는 에너지는?', answer: '신재생에너지', choices: ['신재생에너지', '화력발전', '석탄발전', '액화가스'] },
    { id: 'ENV-013', category: '친환경경영', difficulty: 'NORMAL', question: '사업장에서 나오는 쓰레기의 양 자체를 줄이는 것은?', answer: '폐기물감축', choices: ['폐기물감축', '폐기물매립', '폐기물수출', '폐기물보관'] },
    { id: 'ENV-014', category: '친환경경영', difficulty: 'NORMAL', question: '플라스틱 빨대·비닐봉투 같은 물품 사용을 줄이는 것은?', answer: '일회용품감축', choices: ['일회용품감축', '과대포장', '비닐사용', '대량비치'] },
    { id: 'ENV-015', category: '친환경경영', difficulty: 'NORMAL', question: '새는 곳을 고치고 사용량을 줄여 수돗물을 아끼는 것은?', answer: '물절약', choices: ['물절약', '조경확대', '수압강화', '상시개방'] },
    { id: 'ENV-016', category: '친환경경영', difficulty: 'NORMAL', question: '자연환경과 생태계를 지금 상태로 지키고 가꾸는 것은?', answer: '환경보전', choices: ['환경보전', '환경오염', '환경개발', '환경규제'] },
    { id: 'ENV-017', category: '친환경경영', difficulty: 'HARD',   question: '한 사람이나 조직이 활동하면서 배출하는 온실가스 총량을 뜻하는 말은?', answer: '탄소발자국', choices: ['탄소발자국', '생태용량', '배출권', '탄소세'] },
    { id: 'ENV-018', category: '친환경경영', difficulty: 'HARD',   question: '배출을 완전히 없애지는 못해도 최대한 적게 하도록 전환하는 방향은?', answer: '저탄소', choices: ['저탄소', '고탄소', '무공해', '탄소중립'] },
    { id: 'ENV-019', category: '친환경경영', difficulty: 'HARD',   question: '제품이 환경 기준을 충족했음을 국가가 확인해 표시해 주는 것은?', answer: '친환경인증', choices: ['친환경인증', '품질보증', '원산지표시', '안전검사'] },
    { id: 'ENV-020', category: '친환경경영', difficulty: 'HARD',   question: '폭염·홍수 등 심각해지는 기후변화에 대비하고 완화하는 활동은?', answer: '기후위기대응', choices: ['기후위기대응', '재난복구', '시설보수', '현장점검'] },
  ];

  /* 후보 자동 보충용 예비 풀(모든 문제의 choices 가 이미 충분하면 거의 쓰이지 않음) */
  const EXTRA_DISTRACTORS = [
    '규정준수', '성과평가', '위기대응', '소통강화', '역량개발', '품질관리',
    '사회공헌', '동반성장', '갈등조정', '정보보호', '재해예방', '투명공개',
  ];

  /* --- 개발용 간단 검증 (콘솔 경고만, 게임 동작에는 영향 없음) --- */
  (function selfCheck() {
    const cats = {};
    const ids = new Set();
    QUESTION_BANK.forEach((q) => {
      if (ids.has(q.id)) console.warn('[questions] 중복 ID:', q.id);
      ids.add(q.id);
      cats[q.category] = (cats[q.category] || 0) + 1;
      if (!q.choices || q.choices.indexOf(q.answer) < 0) console.warn('[questions] choices 에 정답 없음:', q.id);
      if (q.question.replace(/[·\s]/g, '').includes(q.answer.replace(/[·\s]/g, ''))) {
        console.warn('[questions] 문장에 정답 노출 가능:', q.id);
      }
    });
    console.log('[questions] 로드됨:', QUESTION_BANK.length, '문항', cats);
  })();

  global.QUESTION_BANK = QUESTION_BANK;
  global.EXTRA_DISTRACTORS = EXTRA_DISTRACTORS;
})(window);
