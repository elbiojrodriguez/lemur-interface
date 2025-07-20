const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const localVideo = document.getElementById('localVideo');
const previewVideo = document.getElementById('myCameraPreview');
const chamarBtn = document.getElementById('chamarBtn');
const targetInput = document.getElementById('targetId');

// Inicialização
document.getElementById('myId').textContent = rtcCore.initialize();

// Controles da interface
function abrirMinhaCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      previewVideo.srcObject = stream;
    })
    .catch(console.error);
}

chamarBtn.onclick = () => {
  const targetId = targetInput.value.trim();
  if (!targetId) return alert('Insira o ID do dono');
  
  rtcCore.startCall(targetId)
    .then(() => {
      localVideo.srcObject = rtcCore.localStream;
    })
    .catch(error => {
      alert(`Falha ao chamar: ${error.message}`);
    });
};

// Configura handlers do core
rtcCore.onRemoteStream = stream => {
  localVideo.srcObject = stream;
};
