const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID().substr(0, 8);
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers(); // ✅ correto

// Elementos UI
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const acceptBtn = document.getElementById('acceptBtn');

// Controles
document.getElementById('endCallBtn').onclick = () => window.close();
document.getElementById('toggleCameraBtn').onclick = toggleCamera;
document.getElementById('muteBtn').onclick = toggleMute;

// Handler de chamada recebida
rtcCore.onIncomingCall = (offer) => {
  acceptBtn.style.display = 'block';
  acceptBtn.onclick = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' }, 
      audio: true 
    }).then(stream => {
      localVideo.srcObject = stream;
      rtcCore.handleIncomingCall(offer, stream, (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });
      acceptBtn.disabled = true;
    }).catch(err => {
      console.error('Erro ao acessar câmera:', err);
    });
  };
};

function toggleCamera() {
  const videoTrack = localVideo.srcObject?.getVideoTracks()[0];
  if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
}

function toggleMute() {
  const audioTrack = localVideo.srcObject?.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    document.getElementById('muteBtn').textContent = 
      audioTrack.enabled ? '🔇' : '🔊';
  }
}
