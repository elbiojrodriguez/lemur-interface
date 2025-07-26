import WebRTCCore from '../core/webrtc-core.js';
import { SIGNALING_SERVER_URL } from '../core/internet-config.js';

export function setupCallButton(targetIdFromURL) {
  window.onload = () => {
    const rtcCore = new WebRTCCore(SIGNALING_SERVER_URL);

    // Gerar ID local aleatório
    const myId = crypto.randomUUID().substr(0, 8);
    document.getElementById('myId').textContent = `Meu ID: ${myId}`;
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

      // Botão "Call" usa o ID da URL automaticamente
      document.getElementById('callActionBtn').onclick = () => {
        if (targetIdFromURL) {
          rtcCore.startCall(targetIdFromURL.trim(), stream);
        } else {
          alert("ID de destino não encontrado.");
        }
      };
    }).catch(err => {
      console.error('Erro ao acessar câmera:', err);
      alert("Erro ao acessar câmera e microfone. Verifique as permissões.");
    });

    rtcCore.setRemoteStreamCallback(stream => {
      remoteVideo.srcObject = stream;
    });
  };
}
