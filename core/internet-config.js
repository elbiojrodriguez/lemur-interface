// 🔧 URL do servidor de sinalização FireWeb
export const SIGNALING_SERVER_URL = 'https://fireweb-sfe0.onrender.com';

// Configurações de ICE Servers (facilmente modificáveis)
export const getIceServers = () => {
  return [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { 
      urls: 'turn:meet-jit-si-turnrelay.jitsi.net:443?transport=tcp',
      username: 'guest',
      credential: 'guest'
    }
  ];
};
