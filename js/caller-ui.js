const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callBtn = document.getElementById('callBtn');
const targetInput = document.getElementById('targetId');

// Inicialização
document.getElementById('myId').textContent = rtcCore.initialize();

// Configura handlers
rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};

// Controles
function startLocalCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localVideo.srcObject = stream;
      rtcCore.localStream = stream;
    })
    .catch(err => {
      console.error("Erro ao acessar câmera:", err);
      alert("Não foi possível acessar a câmera/microfone");
    });
}

callBtn.onclick = () => {
  const targetId = targetInput.value.trim();
  if (!targetId) return alert("Digite o ID do Dono");
  
  rtcCore.startCall(targetId)
    .catch(err => {
      console.error("Erro na chamada:", err);
      alert("Falha ao iniciar chamada");
    });
};
