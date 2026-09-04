// 이미 UI가 만들어져 있다면 다시 만들지 않음
if (!document.getElementById("web-translator-panel")) {

    // 패널 생성
    const panel = document.createElement("div");
    panel.id = "web-translator-panel";

    // 제목
    const title = document.createElement("div");
    title.id = "web-translator-title";
    title.textContent = "Web Translator";

    // 원문 제목
    const originalLabel = document.createElement("div");
    originalLabel.className = "web-translator-label";
    originalLabel.textContent = "원문";

    // 원문 내용
    const originalText = document.createElement("div");
    originalText.id = "web-translator-original";
    originalText.textContent = "Hello, how are you?";

    // 번역 제목
    const resultLabel = document.createElement("div");
    resultLabel.className = "web-translator-label";
    resultLabel.textContent = "번역";

    // 번역 결과
    const resultText = document.createElement("div");
    resultText.id = "web-translator-result";
    resultText.textContent = "아직 번역하지 않았습니다.";

    // 버튼
    const button = document.createElement("button");
    button.id = "web-translator-button";
    button.textContent = "번역 시작";

    //드래그 확인
    button.addEventListener("click", async () => {

    const selectedText =
        window.getSelection().toString().trim();

    if (!selectedText) {
        resultText.textContent =
            "번역할 글자를 먼저 선택해주세요.";
        return;
    }

    originalText.textContent = selectedText;

    resultText.textContent = "번역 중...";

    });

    // 언어 변경
    const languageSelect = document.createElement("select");

    languageSelect.id = "web-translator-language";

    languageSelect.innerHTML = `
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
    `;
    
    // 패널에 요소 추가
    panel.appendChild(title);
    panel.appendChild(originalLabel);
    panel.appendChild(originalText);
    panel.appendChild(resultLabel);
    panel.appendChild(resultText);
    panel.appendChild(button);

    // 웹페이지에 패널 추가
    document.body.appendChild(panel);

    const selectedText = window.getSelection().toString().trim();
    
    console.log(selectedText);
}
