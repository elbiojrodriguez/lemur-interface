const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callBtn = document.getElementById('callBtn');
const targetInput = document.getElementById('targetId');

// ===== DEBUG 1: Verifica se elementos existem =====
console.log('Elementos carregados:', {
  localVideo: !!localVideo,
  remoteVideo: !!remoteVideo,
  callBtn: !!callBtn,
  targetInput: !!targetInput
});

function startLocalCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localVideo.srcObject = stream;

      // ===== DEBUG 2: Verifica stream =====
      console.log('Stream carregado?', stream.id);
      
      callBtn.onclick = () => {
        const targetId = targetInput.value;
        
        // ===== DEBUG 3: Verifica clique e ID =====
        console.log('Botão clicado! ID digitado:', targetId);
        
        if (targetId) {
          console.log('Iniciando chamada para:', targetId);
          rtcCore.startCall(targetId, stream);
          callBtn.disabled = true;
        } else {
          console.log('Erro: ID não preenchido');
        }
      };
    })
    .catch(err => {
      console.error('Erro ao acessar câmera:', err);
    });
}

// ===== DEBUG 4: Verifica WebRTC Core =====
console.log('WebRTCCore carregado?', !!rtcCore.startCall);

startLocalCamera();
