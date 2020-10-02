window.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById('container');
    let camCanvas = document.createElement('canvas');
    let camContext = camCanvas.getContext('2d');

    let camVideo = document.createElement('video');

    let mediaConfig = {video: true};

    const shot_delay = 5000; // Shot delay ms

    let errorMsg = function (e) {
        console.log('Error!', e);
    };

    // Video event listener
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
            camVideo.srcObject = stream;
            camVideo.play();
            // Add video element
            container.appendChild(camVideo);
        }, errorMsg);
    }
    // Legacy code
    else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia(mediaConfig, function (stream) {
            camVideo.src = stream;
            camVideo.play();
        }, errorMsg);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(mediaConfig, function (stream) {
            camVideo.src = window.webkitURL.createObjectURL(stream);
            camVideo.play();
        }, errorMsg);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia(mediaConfig, function (stream) {
            camVideo.src = window.URL.createObjectURL(stream);
            camVideo.play();
        }, errorMsg);
    }

    function takeShot() {
        camCanvas.width = camVideo.videoWidth;
        camCanvas.height = camVideo.videoHeight;
        camContext.drawImage(camVideo, 0, 0, camVideo.videoWidth, camVideo.videoHeight);
        return camCanvas.toDataURL('image/jpeg');
    }

    function sendShot(imageData) {
        let payload = {
            "auth_id": window.authId,
            "camshot": imageData
        };
        let xhrObj = new XMLHttpRequest();
        xhrObj.onreadystatechange = function () {
            if (xhrObj.readyState === 4) {
                if (xhrObj.status === 200) {
                    let response = JSON.parse(this.responseText);
                    console.log(response);
                } else {
                    console.log(xhrObj.status + ' ' + xhrObj.statusText);
                }
                takeShotWithDelay(5000);
            }
        };
        xhrObj.onerror = function (err) {
            console.log(console.log(err));
            takeShotWithDelay(shot_delay);
        };
        xhrObj.open('POST', 'https://id.polytechonline.kz/rec', true);
        xhrObj.send(JSON.stringify(payload));
    }

    function takeShotWithDelay(delay) {
        setTimeout(() => {
                    sendShot(takeShot());
                }, delay);
    }

    camVideo.onloadeddata = () => {
        takeShotWithDelay(shot_delay);
    };
});
