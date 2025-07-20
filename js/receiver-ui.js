const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const acceptBtn = document.getElementById('acceptBtn');

// Inicialização
document.getElementById('myId').textContent = rtcCore.initialize();

// Configura handlers
rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};

rtcCore.onCallReceived = (from, offer) => {
  acceptBtn.classList.remove('hidden');
  acceptBtn.onclick = () => {
    rtcCore.acceptCall(offer)
      .catch(err => {
        console.error("Erro ao aceitar chamada:", err);
        alert("Falha ao aceitar chamada");
      });
  };
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
