class WebRTCCore {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.peer = null;
    this.localStream = null;
    this.currentCall = null;
  }

  // Configuração inicial
  initialize(userId) {
    this.userId = userId || crypto.randomUUID();
    this.socket.emit('register', this.userId);
    return this.userId;
  }

  // Iniciar chamada
  async startCall(targetId, mediaConstraints = { video: true, audio: true }) {
    try {
      this.currentCall = targetId;
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      
      this.peer = new RTCPeerConnection({ 
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Adiciona tracks locais
      this.localStream.getTracks().forEach(track => 
        this.peer.addTrack(track, this.localStream));

      // Configura handlers
      this.peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          this.socket.emit('ice-candidate', { 
            to: targetId, 
            candidate 
          });
        }
      };

      // Cria oferta
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      
      this.socket.emit('call', { 
        to: targetId, 
        offer: this.peer.localDescription 
      });

      return true;
    } catch (error) {
      console.error('Erro ao iniciar chamada:', error);
      this.cleanUp();
      throw error;
    }
  }

  // Aceitar chamada
  async acceptCall(offer, mediaConstraints = { video: true, audio: true }) {
    try {
      this.peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      this.peer.ontrack = ({ streams }) => {
        this.onRemoteStream(streams[0]);
      };

      this.peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          this.socket.emit('ice-candidate', {
            to: this.currentCall,
            candidate
          });
        }
      };

      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);

      this.socket.emit('answer', {
        to: this.currentCall,
        answer: this.peer.localDescription
      });

      return true;
    } catch (error) {
      console.error('Erro ao aceitar chamada:', error);
      this.cleanUp();
      throw error;
    }
  }

  // Limpeza
  cleanUp() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.currentCall = null;
  }

  // Handlers para sobrescrever
  onRemoteStream(stream) {}
  onCallReceived(from, offer) {}
}
