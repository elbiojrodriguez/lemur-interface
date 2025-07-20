class WebRTCCore {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.peer = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  initialize(userId) {
    this.userId = userId;
    this.socket.emit('register', userId);
    return userId;
  }

  setupCallHandlers() {
    this.socket.on('acceptAnswer', data => {
      if (this.peer) {
        this.peer.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('ice-candidate', candidate => {
      if (this.peer) {
        this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  async startCall(targetId, stream) {
    try {
      this.localStream = stream;
      this.peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Adiciona tracks locais
      stream.getTracks().forEach(track => {
        this.peer.addTrack(track, stream);
      });

      // Configura handlers
      this.peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          this.socket.emit('ice-candidate', {
            to: targetId,
            candidate
          });
        }
      };

      this.peer.ontrack = ({ streams }) => {
        this.remoteStream = streams[0];
        if (typeof this.onRemoteStream === 'function') {
          this.onRemoteStream(streams[0]);
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
      throw error;
    }
  }

  setupAnswerHandlers() {
    this.socket.on('incomingCall', data => {
      if (typeof this.onIncomingCall === 'function') {
        this.onIncomingCall(data.from, data.offer);
      }
    });
  }

  async acceptCall(callerId, offer, localStream) {
    try {
      this.peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Adiciona tracks locais ANTES de criar a answer
      if (localStream) {
        localStream.getTracks().forEach(track => {
          this.peer.addTrack(track, localStream);
        });
      }

      this.peer.ontrack = ({ streams }) => {
        this.remoteStream = streams[0];
        if (typeof this.onRemoteStream === 'function') {
          this.onRemoteStream(streams[0]);
        }
      };

      this.peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          this.socket.emit('ice-candidate', {
            to: callerId,
            candidate
          });
        }
      };

      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);

      this.socket.emit('answer', {
        to: callerId,
        answer: this.peer.localDescription
      });

      return true;
    } catch (error) {
      console.error('Erro ao aceitar chamada:', error);
      throw error;
    }
  }

  cleanUp() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.remoteStream = null;
  }
}
