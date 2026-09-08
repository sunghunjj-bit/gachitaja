# 효과음 (선택)

기본적으로 게임은 Web Audio 로 8bit 효과음을 **합성**하므로 파일이 없어도 동작합니다.

파일로 교체하려면 이 폴더에 아래 이름으로 넣고, `js/app.js` 초기화 부분에서
`Effects.sound.useFiles({...})` 를 호출하세요.

| 이벤트 | 파일 예시 |
|--------|-----------|
| 정답 | correct.wav |
| 오답 | wrong.wav |
| 놓침 | missed.wav |
| 콤보 | combo.wav |
| 카운트다운 | count.wav / go.wav |
| 게임오버 | gameover.wav |
| 신기록 | record.wav |
