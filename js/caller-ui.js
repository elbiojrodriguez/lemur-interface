import WebRTCCore from '../core/webrtc-core.js';
import { SIGNALING_SERVER_URL } from '../core/internet-config.js';

window.onload = () => {
  const rtcCore = new WebRTCCore(SIGNALING_SERVER_URL);
  const myId = crypto.randomUUID().substr(0, 8);
  document.getElementById('myId').textContent = myId;
  rtcCore.initialize(myId);
  rtcCore.setupSocketHandlers();

  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');

  document.getElementById('offBtn').onclick = () => window.close();

  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' }, 
    audio: true 
  }).then(stream => {
    localVideo.srcObject = stream;

    document.getElementById('callActionBtn').onclick = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('id');

      if (!targetId) {
        alert("ID de destino não encontrado na URL.");
        return;
      }

      rtcCore.startCall(targetId, stream, (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });

      document.getElementById('callActionBtn').disabled = true;
    };
  }).catch(err => {
    console.error('Erro ao acessar câmera:', err);
    alert("Permita acesso à câmera e microfone para continuar.");
  });

  rtcCore.setRemoteStreamCallback(stream => {
    remoteVideo.srcObject = stream;
  });
};
