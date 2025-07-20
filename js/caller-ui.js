const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callBtn = document.getElementById('callBtn');

// IDÊNTICO ao seu original
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

// MANTIDO do original
rtcCore.onRemoteStream = (stream) => {
  remoteVideo.srcObject = stream;
};

// Inicia câmera automaticamente
startLocalCamera();
