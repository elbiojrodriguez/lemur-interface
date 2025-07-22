// Garanta que estas variáveis são globais
const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
let localStream = null;

// Inicia a câmera e configura o botão
async function startLocalCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;

    // Configura o botão "Chamar" (AGORA FUNCIONAL)
    const callBtn = document.getElementById('callBtn');
    const targetInput = document.getElementById('targetId');

    callBtn.addEventListener('click', () => {
      if (targetInput.value && localStream) {
        rtcCore.startCall(targetInput.value, localStream);
        callBtn.disabled = true;
      } else {
        console.log('Preencha o ID ou aguarde a câmera carregar');
      }
    });

  } catch (err) {
    console.error('Erro ao acessar câmera:', err);
  }
}

// Inicia tudo quando a página carrega
window.onload = startLocalCamera;
