class WebRTCCore {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.peer = null;
    this.localStream = null;
    this.remoteStreamCallback = null; // Adicionado para gerenciar callback
  }

  initialize(userId) {
    this.socket.emit('register', userId);
  }

  startCall(targetId, stream) {
    this.localStream = stream;
    this.peer = new RTCPeerConnection({ 
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
    });

    // Adiciona tracks locais
    stream.getTracks().forEach(track => {
      this.peer.addTrack(track, stream);
    });

    // Configura para receber tracks remotas
    this.peer.ontrack = (event) => {
      if (this.remoteStreamCallback) {
        this.remoteStreamCallback(event.streams[0]);
      }
    };

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

  handleIncomingCall(offer, localStream, callback) { // Modificado para receber localStream
    this.peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Adiciona tracks locais
    if (localStream) {
      localStream.getTracks().forEach(track => {
        this.peer.addTrack(track, localStream);
      });
    }

    // Configura para receber tracks remotas
    this.peer.ontrack = (event) => {
      callback(event.streams[0]);
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

  // Novo método para atualizar o callback de stream remoto
  setRemoteStreamCallback(callback) {
    this.remoteStreamCallback = callback;
  }
}
