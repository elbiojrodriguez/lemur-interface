// Configuração IGUAL à versão original
const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupCallHandlers();

const localVideo = document.getElementById('localVideo');
const previewVideo = document.getElementById('myCameraPreview');
const chamarBtn = document.getElementById('chamarBtn');
const targetInput = document.getElementById('targetId');

// Funções IGUAIS à versão original
function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      localVideo.srcObject = stream;
    })
    .catch(err => {
      console.error('Erro ao abrir câmera local:', err);
    });
}

chamarBtn.onclick = () => {
  const targetId = targetInput.value.trim();
  if (!targetId) return alert('Digite o ID do dono');
  
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localVideo.srcObject = stream;
      rtcCore.startCall(targetId, stream);
    })
    .catch(err => {
      console.error('Erro ao iniciar chamada:', err);
    });
};

// Handler IGUAL ao original
rtcCore.onRemoteStream = stream => {
  localVideo.srcObject = stream;
};
