var fs = require('fs');
var gphoto2 = require('gphoto2');
var GPhoto = new gphoto2.GPhoto2();
var camera = null;
GPhoto.setLogLevel(1);
const { exec } = require("child_process");
GPhoto.list(function (list) {
    if (list.length === 0) {
        console.log("No cameras found");
        return
    };
    camera = list[0];
    console.log('Found', camera.model);
});

exprots.takePicture = function takepicture() {
    camera && camera.takePicture({ download: true }, function (er, data) {
        er && console.error(er);
        fs.writeFileSync(__dirname + '/picture.jpg', data);
    });
}

exports.setFocus = function setFocus(focus) {
    camera.setConfigValue("viewfinder", 1, function (er) {
        er && console.log(er);
    })
    camera.setConfigValue("manualfocusdrive", focus, function (er) {
        er && console.log(er)
    })
}

exports.connectCameraDev = function connectCameraDev() {
    let process = exec(`gphoto2 --stdout --capture-movie | ffmpeg -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video1`, (error, stdout, stderr) => {
        if (error) {
            // console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            // console.log(`stderr: ${stderr}`);
            return;
        }
    });
}
exports.displayVideo = function displayVideo() {
    var video = document.querySelector("#videoElement");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }
}
exports.stopVideo = function stopVideo() {
    process.kill('Term')
}