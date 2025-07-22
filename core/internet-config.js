// Configurações de ICE Servers (facilmente modificáveis)
export const getIceServers = () => {
  return [
    // STUN públicos
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    
    // TURN público do Jitsi (fallback)
    { 
      urls: 'turn:meet-jit-si-turnrelay.jitsi.net:443?transport=tcp',
      username: 'guest',
      credential: 'guest'
    }

    // Adicione outros servidores aqui quando necessário
    // Exemplo com Twilio:
    /*
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: 'seu_token',
      credential: 'seu_token'
    }
    */
  ];
};
