const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupAnswerHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const previewVideo = document.getElementById('myCameraPreview');
const aceitarBtn = document.getElementById('aceitarBtn');
let minhaStream = null;

// Função para ativar câmera local
function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      previewVideo.srcObject = stream;
      minhaStream = stream;
    })
    .catch(err => {
      console.error('Erro ao abrir câmera local:', err);
      alert('Não foi possível acessar a câmera/microfone');
    });
}

// Handler para chamada recebida
rtcCore.onIncomingCall = (from, offer) => {
  aceitarBtn.style.display = 'inline-block';
  aceitarBtn.onclick = () => {
    if (!minhaStream) {
      alert('Ative sua câmera primeiro!');
      return;
    }
    rtcCore.acceptCall(from, offer, minhaStream);
  };
};

// Handler para stream remoto recebido
rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
