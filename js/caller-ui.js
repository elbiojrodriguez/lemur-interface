import WebRTCCore from '../core/webrtc-core.js';

window.onload = () => {
  const rtcCore = new WebRTCCore('https://lemur-signal.onrender.com');
  const myId = crypto.randomUUID().substr(0, 8);

  document.getElementById('myId').textContent = myId;
  rtcCore.initialize(myId);
  rtcCore.setupSocketHandlers();

  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const callBtn = document.getElementById('callBtn');
  const targetInput = document.getElementById('targetId');

  document.getElementById('endCallBtn').onclick = () => window.close();
  document.getElementById('toggleCameraBtn').onclick = toggleCamera;
  document.getElementById('muteBtn').onclick = toggleMute;

  startCamera();

  function startCamera() {
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' }, 
      audio: true 
    }).then(stream => {
      localVideo.srcObject = stream;

      callBtn.onclick = () => {
        const targetId = targetInput.value.trim();
        if (targetId) {
          rtcCore.startCall(targetId, stream);
          callBtn.disabled = true;
        }
      };
    }).catch(err => {
      console.error('Erro ao acessar câmera:', err);
    });
  }

  rtcCore.setRemoteStreamCallback(stream => {
    remoteVideo.srcObject = stream;
  });

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
};
