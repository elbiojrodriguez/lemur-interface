const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupAnswerHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const localVideo = document.getElementById('localVideo');
const aceitarBtn = document.getElementById('aceitarBtn');
let minhaStream = null;

// Ativa câmera automaticamente ao aceitar chamada
async function abrirMinhaCamera() {
  try {
    minhaStream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    localVideo.srcObject = minhaStream;
    return minhaStream;
  } catch (err) {
    console.error('Erro ao acessar câmera:', err);
    throw err;
  }
}

rtcCore.onIncomingCall = async (from, offer) => {
  aceitarBtn.style.display = 'inline-block';
  aceitarBtn.onclick = async () => {
    try {
      // 1. Ativa câmera local automaticamente
      const stream = await abrirMinhaCamera();
      
      // 2. Aceita chamada com a stream local
      await rtcCore.acceptCall(from, offer, stream);
      
      // 3. Mostra feedback visual
      aceitarBtn.textContent = 'Chamada Ativa';
      aceitarBtn.disabled = true;
    } catch (error) {
      console.error('Erro ao aceitar chamada:', error);
      alert('Falha ao aceitar chamada: ' + error.message);
    }
  };
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
