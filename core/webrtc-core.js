acceptCall(callerId, offer, localStream) {
  this.localStream = localStream;
  this.peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

  if (localStream) {
    localStream.getTracks().forEach(track => this.peer.addTrack(track, localStream));
  }

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
