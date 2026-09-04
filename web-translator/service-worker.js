// ======================================================
// Web Translator - service-worker.js
// 실제 인터넷 번역 요청 담당
// ======================================================


chrome.runtime.onMessage.addListener(

    (request, sender, sendResponse) => {


        // 번역 요청이 아니면 무시
        if (request.type !== "TRANSLATE_TEXT") {
            return;
        }


        // 비동기 번역 실행
        translateText(
            request.text,
            request.targetLanguage
        )
            .then((result) => {

                sendResponse({

                    success: true,

                    translatedText:
                        result.translatedText,

                    detectedLanguage:
                        result.detectedLanguage

                });

            })
            .catch((error) => {

                console.error(
                    "Translation error:",
                    error
                );


                sendResponse({

                    success: false,

                    error: error.message

                });

            });


        // sendResponse를 비동기로 사용한다는 의미
        return true;

    }

);


// ======================================================
// Google 번역 요청
// ======================================================

async function translateText(text, targetLanguage) {

    const url =
        "https://translate.googleapis.com/" +
        "translate_a/single" +
        "?client=gtx" +
        "&sl=auto" +
        "&tl=" +
        encodeURIComponent(targetLanguage) +
        "&dt=t" +
        "&q=" +
        encodeURIComponent(text);


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "번역 서버 응답 오류: " +
            response.status
        );

    }


    const data = await response.json();


    // 번역된 여러 문장을 하나로 합침
    const translatedText = data[0]
        .map((item) => item[0])
        .join("");


    // Google이 감지한 원본 언어
    const detectedLanguage = data[2] || "";


    return {

        translatedText,

        detectedLanguage

    };

}
