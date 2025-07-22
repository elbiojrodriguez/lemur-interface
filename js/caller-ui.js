const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callBtn = document.getElementById('callBtn');

// Configura o callback para stream remoto
rtcCore.setRemoteStreamCallback((stream) => {
  remoteVideo.srcObject = stream;
});

function startLocalCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localVideo.srcObject = stream;
      callBtn.onclick = () => {
        const targetId = document.getElementById('targetId').value;
        if (targetId) {
          rtcCore.startCall(targetId, stream);
          callBtn.disabled = true;
        }
      };
    });
}

startLocalCamera();
