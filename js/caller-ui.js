const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID().substr(0, 8);
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupCallHandlers(); // ✅ Correto

// Elementos UI
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callBtn = document.getElementById('callBtn');
const targetInput = document.getElementById('targetId');

// Controles
document.getElementById('endCallBtn').onclick = () => window.close();
document.getElementById('toggleCameraBtn').onclick = toggleCamera;
document.getElementById('muteBtn').onclick = toggleMute;

// Inicia câmera
startCamera();

function startCamera() {
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' }, 
    audio: true 
  }).then(stream => {
    localVideo.srcObject = stream;
    
    callBtn.onclick = () => {
      if (targetInput.value) {
        rtcCore.startCall(targetInput.value, stream);
        callBtn.disabled = true;
      }
    };
  });
}

// Callback para vídeo remoto
rtcCore.onRemoteStream = stream => {
  remoteVideo.srcObject = stream;
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
