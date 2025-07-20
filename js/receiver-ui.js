const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupAnswerHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const previewVideo = document.getElementById('myCameraPreview');
const aceitarBtn = document.getElementById('aceitarBtn');

function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      previewVideo.srcObject = stream;
    })
    .catch(err => {
      console.error('Erro ao abrir câmera local:', err);
    });
}

rtcCore.onIncomingCall = (from, offer) => {
  aceitarBtn.classList.remove('hidden');
  aceitarBtn.onclick = () => {
    rtcCore.acceptCall(from, offer);
  };
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
