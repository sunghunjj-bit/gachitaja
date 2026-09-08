/* =============================================================
 * 가치타자 — 공용 랭킹용 Google Apps Script
 *
 * 이 코드를 구글시트의 [확장 프로그램] → [Apps Script] 에 붙여넣고
 * 웹 앱으로 배포하면, 그 /exec 주소가 가치타자의 공용 랭킹 서버가 됩니다.
 * 자세한 절차: 같은 폴더의 SETUP_RANKING.md
 *
 * - doPost : 게임 결과 1건을 'scores' 시트에 추가
 * - doGet  : 'scores' 시트의 모든 기록을 JSON 으로 반환 (앱이 순위를 계산)
 * ============================================================= */

var SHEET_NAME = 'scores';
var HEADERS = [
  'timestamp', 'playerName', 'department', 'score',
  'correctCount', 'wrongCount', 'accuracy', 'maxCombo',
  'averageResponseTime', 'playedAt',
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function num_(v) {
  var n = Number(v);
  return isFinite(n) ? n : 0;
}

function doGet() {
  try {
    var sh = getSheet_();
    var values = sh.getDataRange().getValues();
    values.shift(); // 헤더 제거
    var rows = values
      .filter(function (r) { return r[1] !== '' && r[1] != null; })
      .map(function (r) {
        return {
          playerName: String(r[1]),
          department: String(r[2]),
          score: num_(r[3]),
          correctCount: num_(r[4]),
          wrongCount: num_(r[5]),
          accuracy: num_(r[6]),
          maxCombo: num_(r[7]),
          averageResponseTime: num_(r[8]),
          playedAt: num_(r[9]) || new Date(r[0]).getTime(),
        };
      });
    return json_(rows);
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');

    var name = String(body.playerName || '').trim().slice(0, 20);
    var dept = String(body.department || '').trim().slice(0, 40);
    var score = num_(body.score);

    // 가벼운 검증 (명백한 쓰레기 데이터만 거름)
    if (!name || !dept) return json_({ ok: false, error: 'name/department 누락' });
    if (score < -10000 || score > 1000000) return json_({ ok: false, error: 'score 범위 오류' });

    var sh = getSheet_();
    sh.appendRow([
      new Date(),
      name,
      dept,
      Math.round(score),
      num_(body.correctCount),
      num_(body.wrongCount),
      num_(body.accuracy),
      num_(body.maxCombo),
      num_(body.averageResponseTime),
      num_(body.playedAt) || Date.now(),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
