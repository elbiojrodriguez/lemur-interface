const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const remoteVideo = document.getElementById('remoteVideo');
const aceitarBtn = document.getElementById('aceitarBtn');

// Inicialização
document.getElementById('myId').textContent = rtcCore.initialize();

// Controles da interface
function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      document.getElementById('myCameraPreview').srcObject = stream;
    })
    .catch(console.error);
}

// Configura handlers do core
rtcCore.onCallReceived = (from, offer) => {
  rtcCore.currentCall = from;
  aceitarBtn.style.display = 'inline-block';
  aceitarBtn.onclick = () => {
    rtcCore.acceptCall(offer)
      .catch(error => {
        alert(`Falha ao aceitar: ${error.message}`);
      });
  };
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
