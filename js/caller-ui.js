const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupCallHandlers();

const remoteVideo = document.getElementById('remoteVideo');
const localVideo = document.getElementById('localVideo');
const chamarBtn = document.getElementById('chamarBtn');
const targetInput = document.getElementById('targetId');

// Ativa câmera local
async function abrirMinhaCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    localVideo.srcObject = stream;
    return stream;
  } catch (err) {
    console.error('Erro ao acessar câmera:', err);
    throw err;
  }
}

chamarBtn.onclick = async () => {
  const targetId = targetInput.value.trim();
  if (!targetId) return alert('Digite o ID do dono');
  
  try {
    // 1. Ativa câmera local
    const stream = await abrirMinhaCamera();
    
    // 2. Inicia chamada
    await rtcCore.startCall(targetId, stream);
    
    // 3. Atualiza UI
    chamarBtn.textContent = 'Chamando...';
    chamarBtn.disabled = true;
  } catch (error) {
    console.error('Erro na chamada:', error);
    alert('Falha ao iniciar chamada: ' + error.message);
  }
};

rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
};
