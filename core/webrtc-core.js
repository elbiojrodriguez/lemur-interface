class WebRTCCore {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.peer = null;
    this.localStream = null;
  }

  initialize(userId) {
    this.socket.emit('register', userId);
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

  startCall(targetId, stream) {
    this.localStream = stream;
    this.peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    stream.getTracks().forEach(track => this.peer.addTrack(track, stream));

    this.peer.onicecandidate = event => {
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

  setupAnswerHandlers() {
    this.socket.on('incomingCall', data => {
      if (typeof this.onIncomingCall === 'function') {
        this.onIncomingCall(data.from, data.offer);
      }
    });
  }

  acceptCall(callerId, offer) {
    this.peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    this.peer.ontrack = event => {
      if (typeof this.onRemoteStream === 'function') {
        this.onRemoteStream(event.streams[0]);
      }
    };

    this.peer.onicecandidate = event => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', { 
          to: callerId, 
          candidate: event.candidate 
        });
      }
    };

    this.peer.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => this.peer.createAnswer())
      .then(answer => this.peer.setLocalDescription(answer))
      .then(() => {
        this.socket.emit('answer', { 
          to: callerId, 
          answer: this.peer.localDescription 
        });
      });
  }
}
