// Adicione no INÍCIO do arquivo
const socket = io('https://lemur-signal.onrender.com');
let peerConnection;
let targetUserId = null;

// Substitua a função de inicialização existente por:
function initCallerUI() {
  const callButton = document.getElementById('callButton'); // Use seu ID real do botão
  
  callButton.addEventListener('click', async () => {
    if (!targetUserId) {
      targetUserId = prompt("Cole o ID do destinatário:");
      if (!targetUserId) return;
    }

    try {
      // 1. Registra no servidor
      socket.emit('register', getCurrentUserId()); // Use sua função existente para pegar o ID

      // 2. Cria peer connection (usando sua configuração existente)
      peerConnection = createPeerConnection(); 

      // 3. Obtém stream local (usando sua função existente)
      const localStream = await getLocalStream();
      
      // 4. Adiciona tracks ao peer connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // 5. Cria e envia oferta
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('call', {
        to: targetUserId,
        offer: offer
      });

      console.log("✅ Oferta enviada para:", targetUserId);

    } catch (error) {
      console.error("Erro ao iniciar chamada:", error);
    }
  });

  // Configura handlers para eventos do servidor
  socket.on('acceptAnswer', async ({ answer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', (candidate) => {
    if (peerConnection && candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });
}

// Mantenha todas as outras funções existentes
