let stream = null;
let recorder = null;
let chunkCount = 0;

chrome.runtime.onMessage.addListener((message) => {
    if (message.target !== "offscreen") return;

    if (message.type === "START_CAPTURE") {
        startCapture(message.streamId);
    }

    if (message.type === "STOP_CAPTURE") {
        stopCapture();
    }
});

async function startCapture(streamId) {
    try {
        stopCapture();

        stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: "tab",
                    chromeMediaSourceId: streamId
                }
            },
            video: false
        });

        const mimeType = "audio/webm;codecs=opus";

        recorder = new MediaRecorder(
            stream,
            MediaRecorder.isTypeSupported(mimeType)
                ? { mimeType }
                : {}
        );

        chunkCount = 0;

        recorder.ondataavailable = async (event) => {
            if (event.data.size === 0) return;

            chunkCount++;

            console.log(
                "오디오 조각:",
                chunkCount,
                event.data.size,
                "bytes"
            );

            // 이후 STT 서버 연결 위치
        };

        recorder.start(3000);

        chrome.runtime.sendMessage({
            type: "CAPTURE_STATUS",
            status: "started"
        });

    } catch (error) {
        console.error(error);

        chrome.runtime.sendMessage({
            type: "CAPTURE_STATUS",
            status: "error",
            error: error.message
        });
    }
}

function stopCapture() {
    if (recorder && recorder.state !== "inactive") {
        recorder.stop();
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    recorder = null;
    stream = null;
}
