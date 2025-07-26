import WebRTCCore from '../core/webrtc-core.js';

window.onload = () => {
  // 1. Inicialização com feedback visual
  const statusElement = document.createElement('div');
  statusElement.id = 'connection-status';
  statusElement.style.cssText = `
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    text-align: center;
    color: white;
    z-index: 100;
    font-size: 14px;
  `;
  document.body.appendChild(statusElement);

  const updateStatus = (message, color = '#fff') => {
    statusElement.textContent = message;
    statusElement.style.color = color;
  };

  // 2. Conexão RTC com tratamento visual
  const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
  const myId = crypto.randomUUID().substr(0, 8);
  
  document.getElementById('myId').innerHTML = `
    <span class="loader"></span>
    <strong>${myId}</strong>
  `;

  updateStatus('Conectando ao servidor...', '#FFC107');
  
  // 3. Controle de mídia aprimorado
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const offBtn = document.getElementById('offBtn');

  // 4. Encerramento com confirmação
  offBtn.onclick = () => {
    if (confirm('Encerrar a chamada?')) {
      offBtn.innerHTML = '<span class="loader"></span> Finalizando...';
      offBtn.disabled = true;
      
      // Limpeza segura
      if (localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }
      
      setTimeout(() => window.close(), 500);
    }
  };

  // 5. Callbacks com estados visuais
  rtcCore.onConnected = () => updateStatus('Conectado', '#4CAF50');
  rtcCore.onDisconnected = () => updateStatus('Desconectado', '#F44336');
  rtcCore.onError = (err) => {
    updateStatus(`Erro: ${err.message}`, '#F44336');
    console.error('Erro RTC:', err);
  };

  rtcCore.initialize(myId);
  rtcCore.setupSocketHandlers();

  // 6. Fluxo de chamada com feedback
  rtcCore.onIncomingCall = (offer) => {
    updateStatus('Chamada recebida!', '#4CAF50');
    
    const btn = document.getElementById('callActionBtn');
    btn.innerHTML = '🔔 Atender';
    btn.style.display = 'block';
    btn.disabled = false;

    btn.onclick = async () => {
      btn.innerHTML = '<span class="loader"></span> Conectando...';
      btn.disabled = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        });
        
        localVideo.srcObject = stream;
        updateStatus('Chamada em andamento', '#4CAF50');
        
        rtcCore.handleIncomingCall(offer, stream, (remoteStream) => {
          remoteVideo.srcObject = remoteStream;
          btn.style.display = 'none';
        });
        
      } catch (err) {
        console.error('Erro de mídia:', err);
        updateStatus('Erro ao acessar câmera', '#F44336');
        btn.innerHTML = '⚠️ Tentar novamente';
        btn.disabled = false;
      }
    };
  };

  // 7. Callback para stream remoto
  rtcCore.setRemoteStreamCallback(stream => {
    remoteVideo.srcObject = stream;
    updateStatus('Chamada ativa', '#4CAF50');
  });
};
