const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID().substr(0, 8);
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

// Elementos UI
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const acceptBtn = document.getElementById('acceptBtn');

// Controles
document.getElementById('endCallBtn').onclick = () => window.close();
document.getElementById('toggleCameraBtn').onclick = toggleCamera;
document.getElementById('muteBtn').onclick = toggleMute;

// Handler de chamada
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
    });
  };
};

// Funções de controle (iguais ao caller)
function toggleCamera() { /* ... */ }
function toggleMute() { /* ... */ }
