class WebRTCCore {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.peer = null;
    this.localStream = null;
  }

  initialize(userId) {
    this.socket.emit('register', userId);
  }

  // IDÊNTICO ao seu original funcionando
  startCall(targetId, stream) {
    this.localStream = stream;
    this.peer = new RTCPeerConnection({ 
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
    });

    // ADICIONA AMBAS TRACKS (áudio e vídeo)
    stream.getTracks().forEach(track => {
      this.peer.addTrack(track, stream);
    });

    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          to: targetId,
          candidate: event.candidate
        });
      }
    };

    this.peer.createOffer()
      .then(offer => this.peer.setLocalDescription(offer))
      .then(() => {
        this.socket.emit('call', {
          to: targetId,
          offer: this.peer.localDescription
        });
      });
  }

  // MANTIDO do seu original
  handleIncomingCall(offer, callback) {
    this.peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.peer.ontrack = (event) => {
      callback(event.streams[0]); // Chama a função quando recebe o stream
    };

    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          to: this.currentCaller,
          candidate: event.candidate
        });
      }
    };

    this.peer.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => this.peer.createAnswer())
      .then(answer => this.peer.setLocalDescription(answer))
      .then(() => {
        this.socket.emit('answer', {
          to: this.currentCaller,
          answer: this.peer.localDescription
        });
      });
  }

  // MÉTODOS ORIGINAIS PRESERVADOS
  setupSocketHandlers() {
    this.socket.on('acceptAnswer', (data) => {
      if (this.peer) {
        this.peer.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('ice-candidate', (candidate) => {
      if (this.peer) {
        this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    this.socket.on('incomingCall', (data) => {
      this.currentCaller = data.from;
      if (this.onIncomingCall) {
        this.onIncomingCall(data.offer);
      }
    });
  }
}
