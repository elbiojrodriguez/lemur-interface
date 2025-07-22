// Adicione no INÍCIO do arquivo
const socket = io('https://lemur-signal.onrender.com');
let peerConnection;

// Substitua a função de inicialização existente por:
function initReceiverUI() {
  // 1. Registra no servidor
  socket.emit('register', getCurrentUserId()); // Use sua função existente

  // 2. Configura handlers
  socket.on('incomingCall', async ({ from, offer }) => {
    console.log("📞 Chamada recebida de:", from);
    
    try {
      // Cria peer connection
      peerConnection = createPeerConnection(); // Use sua função existente
      
      // Configura stream remoto
      peerConnection.ontrack = (event) => {
        // Use sua função existente para mostrar o vídeo
        displayRemoteStream(event.streams[0]); 
      };

      // Processa oferta
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // Envia resposta
      socket.emit('answer', {
        to: from,
        answer: answer
      });

    } catch (error) {
      console.error("Erro ao processar chamada:", error);
    }
  });

  // Handler para ICE candidates
  socket.on('ice-candidate', (candidate) => {
    if (peerConnection && candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });
}

// Mantenha todas as outras funções existentes
