const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const acceptBtn = document.getElementById('acceptBtn');

// MODIFICADO para ativar câmera automaticamente ao receber chamada
rtcCore.onIncomingCall = (offer) => {
  acceptBtn.style.display = 'block';
  acceptBtn.onclick = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(localStream => {
        localVideo.srcObject = localStream;
        rtcCore.handleIncomingCall(offer, (remoteStream) => {
          remoteVideo.srcObject = remoteStream;
        });
        acceptBtn.disabled = true;
      });
  };
};
