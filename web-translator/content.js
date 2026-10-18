// ======================================================
// Web Translator - content.js
// 웹페이지에서 선택한 텍스트를 번역 패널에 표시
// ======================================================


// 이미 번역 패널이 만들어져 있으면 중복 생성하지 않음
if (!document.getElementById("web-translator-panel")) {

    // 마지막으로 사용자가 선택한 텍스트 저장
    let selectedText = "";


    // --------------------------------------------------
    // 1. 패널 생성
    // --------------------------------------------------

    const panel = document.createElement("div");
    panel.id = "web-translator-panel";


    // --------------------------------------------------
    // 2. 제목
    // --------------------------------------------------

    const title = document.createElement("div");
    title.id = "web-translator-title";
    title.textContent = "Web Translator";

    // 접기 / 펼치기 버튼
    const toggleButton = document.createElement("button");
    toggleButton.id = "web-translator-toggle";
    toggleButton.type = "button";
    toggleButton.textContent = "−";
    toggleButton.title = "번역창 접기";
    toggleButton.setAttribute("aria-expanded", "true");

    title.appendChild(toggleButton);


    // --------------------------------------------------
    // 3. 설명
    // --------------------------------------------------

    const description = document.createElement("div");
    description.id = "web-translator-description";
    description.textContent =
        "웹페이지에서 번역할 문장을 드래그한 뒤 번역 시작을 누르세요.";


    // --------------------------------------------------
    // 4. 목표 언어 선택
    // --------------------------------------------------

    const languageLabel = document.createElement("div");
    languageLabel.className = "web-translator-label";
    languageLabel.textContent = "번역 언어";


    const languageSelect = document.createElement("select");
    languageSelect.id = "web-translator-language";

    languageSelect.innerHTML = `
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="zh-CN">中文</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
    `;


    // --------------------------------------------------
    // 5. 원문 영역
    // --------------------------------------------------

    const originalLabel = document.createElement("div");
    originalLabel.className = "web-translator-label";
    originalLabel.textContent = "원문";


    const originalText = document.createElement("div");
    originalText.id = "web-translator-original";
    originalText.textContent = "번역할 문장을 선택해주세요.";


    // --------------------------------------------------
    // 6. 번역 결과 영역
    // --------------------------------------------------

    const resultLabel = document.createElement("div");
    resultLabel.className = "web-translator-label";
    resultLabel.textContent = "번역";


    const resultText = document.createElement("div");
    resultText.id = "web-translator-result";
    resultText.textContent = "아직 번역하지 않았습니다.";


    // --------------------------------------------------
    // 7. 번역 버튼
    // --------------------------------------------------

    const button = document.createElement("button");
    button.id = "web-translator-button";
    button.textContent = "번역 시작";


    // --------------------------------------------------
    // 8. 패널에 요소 추가
    // --------------------------------------------------

    panel.appendChild(title);
    panel.appendChild(description);

    panel.appendChild(languageLabel);
    panel.appendChild(languageSelect);

    panel.appendChild(originalLabel);
    panel.appendChild(originalText);

    panel.appendChild(resultLabel);
    panel.appendChild(resultText);

    panel.appendChild(button);


    // --------------------------------------------------
    // 9. 웹페이지에 패널 추가
    // --------------------------------------------------

    document.body.appendChild(panel);
    
    // 접기 / 펼치기 동작
    let isCollapsed = false;

    toggleButton.addEventListener("click", (event) => {
        event.stopPropagation();

        isCollapsed = !isCollapsed;

        // 제목을 제외한 나머지 요소 표시 여부 변경
        Array.from(panel.children).forEach((element) => {
            if (element !== title) {
                element.hidden = isCollapsed;
            }
        });

        toggleButton.textContent = isCollapsed ? "+" : "−";
        toggleButton.title = isCollapsed
            ? "번역창 펼치기"
            : "번역창 접기";

        toggleButton.setAttribute(
            "aria-expanded",
            String(!isCollapsed)
        );
    });


    // --------------------------------------------------
    // 9-1. 번역창 드래그 기능
    // --------------------------------------------------

    title.style.cursor = "move";
    title.style.userSelect = "none";

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // 제목을 누르면 드래그 시작
    title.addEventListener("mousedown", (event) => {

        if (event.target.closest("#web-translator-toggle")) {
            return;
        }
        if (event.button !== 0) return;

        const rect = panel.getBoundingClientRect();

        isDragging = true;

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // 기존 right 기준 위치를 left 기준으로 전환
        panel.style.left = rect.left + "px";
        panel.style.top = rect.top + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";

        event.preventDefault();
    });

    // 마우스 이동에 따라 번역창 이동
    document.addEventListener("mousemove", (event) => {

        if (!isDragging) return;

        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;

        const x = Math.max(
            0,
            Math.min(event.clientX - offsetX, Math.max(0, maxX))
        );

        const y = Math.max(
            0,
            Math.min(event.clientY - offsetY, Math.max(0, maxY))
        );

        panel.style.left = x + "px";
        panel.style.top = y + "px";
    });

    // 마우스를 놓으면 드래그 종료
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });


    // --------------------------------------------------
    // 10. 사용자가 웹페이지에서 선택한 글자 저장
    // --------------------------------------------------

    document.addEventListener("mouseup", (event) => {

        // 번역 패널 내부를 클릭했을 때는 무시
        if (panel.contains(event.target)) {
            return;
        }


        const selection = window.getSelection()
            .toString()
            .trim();


        if (selection.length > 0) {

            selectedText = selection;

            originalText.textContent = selectedText;

            resultText.textContent =
                "번역 시작 버튼을 눌러주세요.";
        }

    });


    // --------------------------------------------------
    // 11. 번역 버튼 클릭
    // --------------------------------------------------

    button.addEventListener("click", async () => {

        // 선택한 글자가 없을 경우
        if (!selectedText) {

            resultText.textContent =
                "번역할 글자를 먼저 선택해주세요.";

            return;
        }


        // 사용자가 선택한 목표 언어
        const targetLanguage = languageSelect.value;


        // 번역 시작 상태
        button.disabled = true;
        button.textContent = "번역 중...";

        resultText.textContent = "번역 중입니다...";


        try {

            // service-worker.js에 번역 요청 전달
            const response = await chrome.runtime.sendMessage({

                type: "TRANSLATE_TEXT",

                text: selectedText,

                targetLanguage: targetLanguage

            });


            // 서버 또는 번역 과정에서 오류 발생
            if (!response || !response.success) {

                throw new Error(
                    response?.error || "번역에 실패했습니다."
                );

            }


            // 번역 결과 표시
            resultText.textContent =
                response.translatedText;


            // 감지 언어가 있다면 원문 제목에 표시
            if (response.detectedLanguage) {

                originalLabel.textContent =
                    `원문 (${response.detectedLanguage})`;

            }

        }

        catch (error) {

            console.error("번역 오류:", error);

            resultText.textContent =
                "번역 중 오류가 발생했습니다.";

        }

        finally {

            button.disabled = false;

            button.textContent = "번역 시작";

        }

    });

}
