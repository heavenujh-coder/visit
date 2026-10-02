export const APPS_SCRIPT_CODE = `/**
 * [구글 스프레드시트 방명록 API]
 * 이 스크립트를 스프레드시트의 [확장 프로그램] > [Apps Script]에 붙여넣고 웹 앱으로 배포하세요.
 */

// 시트가 없거나 첫 줄(헤더)이 없을 경우 자동으로 세팅
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("방명록") || ss.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    // 헤더 행 생성 및 서식 지정
    var headers = ["ID", "작성자", "응원한마디", "테마", "작성일시", "좋아요"];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#F3F4F6");
  }
  return sheet;
}

// 1. 방명록 목록 불러오기 (GET)
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    // 데이터가 헤더만 있거나 비어있는 경우
    if (data.length <= 1) {
      return createJsonResponse({
        status: "success",
        total: 0,
        data: []
      });
    }

    var rows = data.slice(1); // 헤더 제외
    var entries = rows.map(function(row, idx) {
      return {
        id: String(row[0] || "row_" + (idx + 1)),
        name: String(row[1] || "익명"),
        message: String(row[2] || ""),
        theme: String(row[3] || "yellow"),
        createdAt: row[4] ? new Date(row[4]).toISOString() : new Date().toISOString(),
        likes: Number(row[5]) || 0
      };
    });

    // 최신 글이 위로 오도록 역순 정렬
    entries.reverse();

    return createJsonResponse({
      status: "success",
      total: entries.length,
      data: entries
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

// 2. 방명록 새 글 등록 (POST)
function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "{}";
    var params = JSON.parse(raw);

    var sheet = getOrCreateSheet();

    // 좋아요 증가 요청 처리
    if (params.action === "like" && params.id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(params.id)) {
          var currentLikes = Number(data[i][5]) || 0;
          sheet.getRange(i + 1, 6).setValue(currentLikes + 1);
          return createJsonResponse({
            status: "success",
            action: "like",
            likes: currentLikes + 1
          });
        }
      }
      return createJsonResponse({ status: "error", message: "항목을 찾을 수 없습니다." });
    }

    // 신규 방명록 등록
    var id = "msg_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000);
    var name = (params.name || "익명 친구").trim();
    var message = (params.message || "").trim();
    var theme = params.theme || "yellow";
    var createdAt = new Date().toISOString();
    var likes = 0;

    if (!message) {
      return createJsonResponse({
        status: "error",
        message: "메시지 내용이 비어있습니다."
      });
    }

    // 시트에 새 행 추가: [ID, 작성자, 메시지, 테마, 작성일시, 좋아요]
    sheet.appendRow([id, name, message, theme, createdAt, likes]);

    var newEntry = {
      id: id,
      name: name,
      message: message,
      theme: theme,
      createdAt: createdAt,
      likes: likes
    };

    return createJsonResponse({
      status: "success",
      message: "방명록이 등록되었습니다.",
      data: newEntry
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

// JSON 응답 생성 헬퍼
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const INITIAL_DEMO_ENTRIES = [
  {
    id: 'demo-1',
    name: '민트초코러버 🌿',
    message: '구글 스프레드시트가 이렇게 멋진 실시간 데이터베이스가 되다니 신기해요! 프로젝트 대박 나세요 🎉',
    theme: 'mint' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 5,
  },
  {
    id: 'demo-2',
    name: '코딩하는 라이언 🦁',
    message: 'Apps Script 웹앱으로 배포하니까 서버 비용도 0원이고 너무 간편하네요. 응원합니다 파이팅! ✨',
    theme: 'yellow' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 12,
  },
  {
    id: 'demo-3',
    name: '새싹 개발자 🌱',
    message: '가이드 보고 따라 하니까 3분 만에 내 구글 시트에 실시간으로 방명록 글이 쌓여요! 최고입니다 👍',
    theme: 'peach' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    likes: 8,
  },
  {
    id: 'demo-4',
    name: '별빛밤하늘 🌌',
    message: '오늘 하루도 모두 수고 많으셨습니다. 따뜻한 한마디 남기고 가요~ 행복한 내일 되세요 ☕',
    theme: 'lavender' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 19,
  },
];
