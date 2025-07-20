// Configuração IGUAL à versão original
const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupAnswerHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const aceitarBtn = document.getElementById('aceitarBtn');

// Funções IGUAIS à versão original
function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      remoteVideo.srcObject = stream;
    })
    .catch(err => {
      console.error('Erro ao abrir câmera local:', err);
    });
}

// Handlers IGUAIS ao original
rtcCore.onIncomingCall = (from, offer) => {
  aceitarBtn.style.display = 'inline-block';
  aceitarBtn.onclick = () => {
    rtcCore.acceptCall(from, offer);
  };
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
