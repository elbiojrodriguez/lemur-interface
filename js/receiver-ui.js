const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupAnswerHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const previewVideo = document.getElementById('myCameraPreview');
const aceitarBtn = document.getElementById('aceitarBtn');
let minhaStream = null;

function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      previewVideo.srcObject = stream;
      minhaStream = stream;
    })
    .catch(err => {
      console.error('Erro ao abrir câmera local:', err);
    });
}

rtcCore.onIncomingCall = (from, offer) => {
  aceitarBtn.classList.remove('hidden');
  aceitarBtn.onclick = () => {
    rtcCore.acceptCall(from, offer);

    const checkPeerReady = setInterval(() => {
      if (rtcCore.peer && minhaStream) {
        minhaStream.getTracks().forEach(track => {
          rtcCore.peer.addTrack(track, minhaStream);
        });
        clearInterval(checkPeerReady);
      }
    }, 100);
  };
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
