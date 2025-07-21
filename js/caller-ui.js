// Sobrescreve a inicialização padrão para mobile
document.addEventListener('DOMContentLoaded', function() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Configurações mobile
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const callBtn = document.getElementById('callBtn');
    const targetIdInput = document.getElementById('targetIdInput');

    // 1. Inicia a câmera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideo.srcObject = stream;
        
        // 2. Cria peer connection (usando função do core)
        const peerConnection = createPeerConnection({
          iceServers: STUN_SERVERS,
          onTrack: (event) => {
            remoteVideo.srcObject = event.streams[0];
            console.log("✅ Stream remoto recebido!");
          }
        });

        // 3. Adiciona stream local
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // 4. Botão de chamada
        callBtn.addEventListener('click', () => {
          const targetId = targetIdInput.value.trim();
          if (!targetId) return alert("Digite um ID válido!");

          // Usa a função do core para iniciar chamada
          startCall(peerConnection, targetId)
            .then(() => console.log("📞 Chamando..."))
            .catch(err => console.error("Erro ao chamar:", err));
        });

      })
      .catch(err => {
        console.error("Erro ao acessar mídia:", err);
        alert("Permissão de câmera/microfone negada!");
      });

  } else {
    // Mantém o comportamento original para desktop
    initCallerUI();
  }
});
