const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
const myId = crypto.randomUUID();
document.getElementById('myId').textContent = myId;
rtcCore.initialize(myId);
rtcCore.setupSocketHandlers();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const acceptBtn = document.getElementById('acceptBtn');

rtcCore.onIncomingCall = (offer) => {
  acceptBtn.style.display = 'block';
  acceptBtn.onclick = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(localStream => {
        localVideo.srcObject = localStream;
        // Agora passamos o localStream para handleIncomingCall
        rtcCore.handleIncomingCall(offer, localStream, (remoteStream) => {
          remoteVideo.srcObject = remoteStream;
        });
        acceptBtn.disabled = true;
      });
  };
};
